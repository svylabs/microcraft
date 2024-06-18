#!/usr/bin/env node

const { Command } = require('commander');
const axios = require('axios');
const program = new Command();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 *  Create a json file,
 *    - populate it with contract group data- name, description.
 *    - post the contract group detail to the api
 *    - get the response and store the contract group id in the json file
 *  
 */

const API_URL = "https://handycraft-415122.oa.r.appspot.com";
const CONTRACT_REGISTRY = "microcraft-registry.json";
const REGISTRY_DIRECTORY = ".mcregistry";
const API_KEY = process.env.MC_API_KEY;

const writeToRegistry = (data) => {
  fs.writeFile(CONTRACT_REGISTRY, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error writing to registry:', err.message);
    }
  });
}

const processContractArtifacts = (artifactPath) => {
  const contracts = [];
  const dirs = fs.readdirSync(artifactPath);
  dirs.forEach(contractDir => {
    const contractPath = path.join(artifactPath, contractDir);
    const contractFiles = fs.readdirSync(contractPath);
    contractFiles.forEach(file => {
      const filePath = path.join(contractPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile() && file.endsWith('.json') && file.indexOf(".dbg.json") === -1) {
        const artifact = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        //console.log('Processing artifact:', artifact);
        contracts.push({
          name: artifact.contractName,
          sourceName: artifact.sourceName,
          abi: artifact.abi,
          bytecode: artifact.bytecode,
        })
      }
    });
  });
  return contracts;
}

const processContract = async (contract, microcraftRegistry) => {
  const newContractResponse = await axios.post(`${API_URL}/contract-registry/new`, { name: contract.name, description: contract.sourceName, contract_group_id: microcraftRegistry.id, team: "public"}, {
    headers: {
      'Authorization': `${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  console.log(`${contract.name} Contract registered with ID:`, newContractResponse.data.key.name);
  contract.id = newContractResponse.data.key.name;
  const version = crypto.createHash('sha256').update(JSON.stringify(contract.abi)).digest('hex').substring(0, 12);
  const properties = {
      abi: contract.abi
  };
  microcraftRegistry.contracts = microcraftRegistry.contracts || {};

  const versionResponse = await axios.post(`${API_URL}/contract-registry/version/new`, { contract_id: contract.id, version, properties }, {
    headers: {
      'Authorization': `${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  console.log('New contract version registered:', versionResponse.data);

  let contractInRegistry = microcraftRegistry.contracts[contract.id] || { name: contract.name, currentVersion: version, versions: {}};
  let contractVersionInRegistry = contractInRegistry.versions[version] || { version: version, properties: properties };
  contractVersionInRegistry.createdDate = new Date().toISOString();
  if (contractInRegistry.currentVersion) {
    contractVersionInRegistry.previousVersion = contractInRegistry.currentVersion;
  }
  contractInRegistry.versions[version] = contractVersionInRegistry;
  contractInRegistry.currentVersion = version;
  contractInRegistry.updatedDate = new Date().toISOString();
  microcraftRegistry.contracts[contract.id] = contractInRegistry;
  return contractInRegistry;
}

if (!API_KEY) {
  console.error("Set MC_API_KEY environment variable before running the command");
  return 1;
}

if (!fs.existsSync(REGISTRY_DIRECTORY)) {
  fs.mkdirSync(REGISTRY_DIRECTORY);
}

let microcraftRegistry = null;
try {
  const data = fs.readFileSync(CONTRACT_REGISTRY, 'utf8');
  if (data) {
    microcraftRegistry = JSON.parse(data);
  }
} catch (error) {
  
}

program
  .command('init <name> <description>')
  .description('Initialize a new contract group')
  .action(async (name, description) => {
    try {
      if (microcraftRegistry) {
        console.error('There is an existing registry file in this repo');
        return;
      }
      const response = await axios.post(`${API_URL}/contract-registry/group/new`, { name, description, owner: 'public', type: 'solidity' }, {
         headers: {
            'Authorization': `${API_KEY}`,
            'Content-Type': 'application/json'
         }
      });
      console.log('Contract group registered:', response.data);
      microcraftRegistry = { id: response.data.key.name, name: name, description: description, status: 'group-created', registered: new Date().toISOString()};
      writeToRegistry(microcraftRegistry);
    } catch (error) {
      console.error('Error registering contract group:', error.message);
    }
  });

program
  .command('register')
  .option('--artifact-path <path>', 'Path where the contract artifacts are stored', './artifacts/contracts')
  .description('Register a new contract, version, and the deployed instance')
  .action(async (options) => {
    try {
      if (!microcraftRegistry) {
        console.error('No contract group found in the registry, run `microcraft init` first');
        return;
      }
      const artifactPath = options.artifactPath;
      const contracts = processContractArtifacts(artifactPath);
      console.log('Contracts:', contracts);

      for (let i=0;i<contracts.length;i++) {
        const contract = contracts[i];
        console.log("Processing contract: ", contract.name);
        await processContract(contract, microcraftRegistry);
      }
      writeToRegistry(microcraftRegistry);

    } catch (error) {
      console.error('Error during registration:', error.message);
    }
  });

program.parse(process.argv);

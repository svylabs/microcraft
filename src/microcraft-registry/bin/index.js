#!/usr/bin/env node

const { Command } = require('commander');
const axios = require('axios');
const program = new Command();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const API_URL =  process.env.DEVELOPMENT ? "http://localhost:8080" : "https://microcraft.dev";
const CONTRACT_REGISTRY = "microcraft-registry.json";
const API_KEY = process.env.MC_API_KEY;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const writeToRegistry = (data) => {
  fs.writeFile(CONTRACT_REGISTRY, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error writing to registry:', err.message);
    }
  });
}

const buildContractFromArtifacts = (artifactPath) => {
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

const registerContract = async (contract, microcraftRegistry) => {
  const newContractResponse = await axios.post(`${API_URL}/contract-registry/new`, { name: contract.name, description: contract.sourceName, contract_group_id: microcraftRegistry.id, team: microcraftRegistry.visibility}, {
    headers: {
      'Authorization': `APIKey-v1 ${API_KEY}`,
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
      'Authorization': `APIKey-v1 ${API_KEY}`,
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

const getVisibility = async () => {
    try {
       const userResponse = await axios.get(`${API_URL}/auth/user`, {
          headers: {
             'Authorization': `APIKey-v1 ${API_KEY}`,
             'Content-Type': 'application/json'
          }
       });
       const userTeams = userResponse.data.teams;
       if (userTeams.length === 0) {
          const response = await question('No teams found for the user, do you want to register the contract publicly? (y/n)');
          if (response === 'y' || response === 'Y' || response === 'yes' || response === 'YES') {
             return 'public';
          } else {
              console.error('No teams found for the user');
              process.exit(1);
          }
       } else {
          console.log(`Found ${userTeams.length} teams for the user, fetching team details..`);
          const teamDetails = await axios.get(`${API_URL}/team/list`, {
              headers: {
                  'Authorization': `APIKey-v1 ${API_KEY}`,
                  'Content-Type': 'application/json'
              }
            });
          const teams = teamDetails.data;
          for (let i=0;i<teams.length;i++) {
              console.log(`${i+1}. ${teams[i].name}`);
          }
          const response = await question('Enter the team number under which you want to register the contract: ');
          const team = teams[parseInt(response)-1];
          return team.id;
       }
    } catch (error) {
       console.error('Error', error.message);
    }
}


const initializeApp = () => {
  if (!API_KEY) {
    console.error("Set MC_API_KEY environment variable before running the command");
    process.exit(1);
  }
  let microcraftRegistry = null;
  try {
    const data = fs.readFileSync(CONTRACT_REGISTRY, 'utf8');
    if (data) {
      microcraftRegistry = JSON.parse(data);
    }
  } catch (error) {
    // Do nothing
  }
  return microcraftRegistry;
}

program
  .command('init <name> <description>')
  .description('Initialize a new contract group')
  .action(async (name, description) => {
    let microcraftRegistry = initializeApp();
    try {
      if (microcraftRegistry) {
        console.error('There is an existing registry file in this repo');
        return;
      }
      const visibility = await getVisibility();
      const response = await axios.post(`${API_URL}/contract-registry/group/new`, { name, description, owner: visibility, type: 'solidity' }, {
         headers: {
            'Authorization': `APIKey-v1 ${API_KEY}`,
            'Content-Type': 'application/json'
         }
      });
      console.log('Contract group registered');
      microcraftRegistry = { id: response.data.key.name, name: name, description: description, visibility: visibility, registered: new Date().toISOString()};
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
    let microcraftRegistry = initializeApp();
    try {
      if (!microcraftRegistry) {
        console.error('No contract group found in the registry, run `microcraft init` first');
        return;
      }
      const artifactPath = options.artifactPath;
      const contracts = buildContractFromArtifacts(artifactPath);
      //console.log('Contracts:', contracts);

      for (let i=0;i<contracts.length;i++) {
        await registerContract(contracts[i], microcraftRegistry);
      }
      writeToRegistry(microcraftRegistry);

    } catch (error) {
      console.error('Error during registration:', error.message);
    }
  });

program.parse(process.argv);

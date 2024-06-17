#!/usr/bin/env node

const { Command } = require('commander');
const axios = require('axios');
const program = new Command();

program
  .command('init <name> <description>')
  .description('Initialize a new contract group')
  .action(async (name, description) => {
    try {
      const response = await axios.post('http://api.example.com/contract-group', { name, description });
      console.log('Contract group registered:', response.data);
    } catch (error) {
      console.error('Error registering contract group:', error.message);
    }
  });

program
  .command('register')
  .option('--all', 'Register all components')
  .option('--deployment', 'Register deployment instance')
  .description('Register a new contract, version, and instance')
  .action(async (options) => {
    try {
      // Register new contract
      const contractResponse = await axios.post('http://api.example.com/contract/new');
      const contractId = contractResponse.data.id;
      console.log('New contract registered with ID:', contractId);

      // Register new version
      const versionResponse = await axios.post('http://api.example.com/contract/version/new', { contractId });
      const versionId = versionResponse.data.id;
      console.log('New contract version registered with ID:', versionId);

      if (options.deployment || options.all) {
        // Register new deployment instance
        const instanceResponse = await axios.post('http://api.example.com/contract/instance/new', { versionId });
        console.log('New contract instance registered:', instanceResponse.data);
      }
    } catch (error) {
      console.error('Error during registration:', error.message);
    }
  });

program.parse(process.argv);

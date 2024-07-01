# Usage Docs

1. [Signup](#signing-up)
2. [Creating team (optional)](#creating-team)
3. [Creating App](#creating-app)
    - [From UI](#from-ui)
    - [From CLI / Locally](#from-cli--locally)
        - [Initialise App from CLI](#initialize-app-from-cli)
        - [Structure of the app](#structure-of-the-app)
        - [Add required fields](#add-fields)
        - [Configure actions](#custom-action)
        - [Contract Dependencies](#contract-dependencies)
        - [Testing](#testing)
        - [Publishing](#publishing)
4. [Registering Contracts](#registering-contracts)
5. [Example apps](#example-apps)
    - [Simple apps](#simple-app)
    - [App that connects to a wallet](#app-that-connects-to-a-wallet)
    - [App that reads data from blockchain](#app-that-reads-data-from-blockchain)
    - [App to make a transaction](#app-to-make-a-transaction)

# Signing up

Signing up is possible using github account at present.

# Creating Team

Creating teams is optional. You can use the UI interface to create teams and add users.

# Creating App

App creation can be done in two ways:

## From UI

Creating App from UI consists of 5 steps.

1. Setting up basic parameters of the app
2. Configure visibility, network and contracts that will be used in the app.
3. Setting up the layout
4. Preview and test the app
5. Publish

## From CLI / Locally

Apps can also be created and published from the microcraft CLI and manually editing the json representation of the app.

### Installing the CLI

`
    npm install -g microcraft
`

### Initialize App from CLI

`
    npx microcraft app init
`

This command will guide you through the required inputs like name, description, whether the app is private / public and the targetted network and contracts the app is built for.

### Structure of the app

The app is essentially defined as a json structure like shown below.

```
   {
      "name": "App name",
      "description": "Description of the app",
      "components": [
          {
              "type": "text",
              "placement": "input",
              "id": "xyz", // this id can be access from within custom code when needed
              "label": "Label for the field"
          },
          {
              "type": "button",
              "placement": "action",
              "id": "click",
              "label": "Submit",
              "code": "write the code here" // or alternatively, you can write a code to a file called actions/submit_action.js and refer the file like below
              "codeRef": "actions/submit_action.js"
          },
          {
              "type": "text",
              "placement": "output",
              "id": "output",
              "label": "Output value"
          }
      ]
   }
```

### Add Fields

Add any input / output fields that are needed. The available input and output types are

- text
- json
- slider
- dropdown
- checkbox
- connected_wallet
- graph (for output)

### Custom action

Actions (like buttons) can contain code or a reference to the code that will be executed when the component is clicked. The code can return some data (eg: outputs) that will be populated by the framework.

### Contract Dependencies

Contract and network dependencies can be added as shown below

```
   {
       "name": "App name"
       ...other fields
       "contracts": {
          "SwapContract": {
            "address": "0x...",
            "abi": [
               // abi of the swap contract
          ]},
          "BorrowContract": {
             "address": "0x..",
             "abi": [
                // abi of the borrow
             ]
          }
       },
       "network": {
          "type": "ethereum",
          "rpc_url": "",
          "chain_id": ""
       }
   }
```

### Testing

[Microcraft External App](https://microcraft.dev/app/external) page can load apps from github.

#### Testing apps using github link

#### Testing apps available locally

```
    npx microcraft open <directory-where-app-is-located>
```

### Publishing

## Registering Contracts
## Example Apps
### Simple App
### App that connects to a wallet
### App that reads data from blockchain
### App to make a transaction
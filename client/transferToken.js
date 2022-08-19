/*
A script that gets some basic info on a function in a smart contract on the Ethereum blockchain, then shows the result in the console.

This script will only get info from the contract we specify, be sure your queried address has public readable (call) functions.

For an explanation of this code, navigate to the wiki https://github.com/ThatOtherZach/Web3-by-Example/wiki/Get-Contract-Info
*/

// Require the Web3 Module
var Web3 = require('web3');
const url = "https://eth-goerli.g.alchemy.com/v2/H88vatHwN7YFNwQ5yWkYAsZh4DxDsk00";

// Show Web3 where it needs to look for a connection to Ethereum.
web3 = new Web3(new Web3.providers.HttpProvider(url));
fs = require('fs');
// Write to the console the script will run shortly
console.log('Calling Contract.....');

// Define the ABI of the contract, used to return the desired values
// var abi = ABI-JSON-INTERFACE;
const abi = JSON.parse(fs.readFileSync('abis/VietTestToken.json', 'utf-8'));
// Define the Ethereum address of the smart contract
var addr = "0x981C37E66aD5c6D4Cab29e67AAAb23c0BA473264";
var contractAddr = ('0x64D6eED43964cdc23ac660F7215e1905C5392A47');
// var privateKey = Buffer.from('1a747a0072cbf3d492f0bdd90ca708bf0c003df9f1fc035cc09f39395ab3f1a3', 'hex');
var privateKey = '1a747a0072cbf3d492f0bdd90ca708bf0c003df9f1fc035cc09f39395ab3f1a3'

// Build a new variable based on the Web3 API including the ABI and address of the contract
var Contract = new web3.eth.Contract(abi, contractAddr);

// Put it all together in a call and return the result to the console
// FUNCTION must the name of the function you want to call.
// Contract.methods.transfer('0x90B25ebA9545eD92e321f13F82E7f0330fF8e639', 1).send().then(console.log).catch(console.error);
var recieverAddr = "0x90B25ebA9545eD92e321f13F82E7f0330fF8e639"
var transfer = Contract.methods.transfer(recieverAddr,1000000);
var encodedABI = transfer.encodeABI();

var tx = {
    from: addr,
    to: contractAddr,
    gas: 2000000,
    data: encodedABI
  }; 

  web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
    var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);

    tran.on('confirmation', (confirmationNumber, receipt) => {
      console.log('confirmation: ' + confirmationNumber);
    });

    tran.on('transactionHash', hash => {
      console.log('hash');
      console.log(hash);
    });

    tran.on('receipt', receipt => {
      console.log('reciept');
      console.log(receipt);
    });

    tran.on('error', console.error);
  });
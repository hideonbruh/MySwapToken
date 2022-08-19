
async function main() {
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
  const abiVietTestToken = JSON.parse(fs.readFileSync('abis/VietTestToken.json', 'utf-8'));
  const abiTokenB = JSON.parse(fs.readFileSync('abis/TokenB.json', 'utf-8'));
  const abiAddrSwapContract = JSON.parse(fs.readFileSync('abis/SwapToken.json', 'utf-8'));
  // Define the Ethereum address of the smart contract
  var addr = "0x981C37E66aD5c6D4Cab29e67AAAb23c0BA473264";
  var contractAddr = ('0x64D6eED43964cdc23ac660F7215e1905C5392A47');
  var contractAddrTokenB = ('0xb1B24ED4aea4eD254500E22BEb9C92BAD714f412');
  var contractAddrSwapToken = ('0xeAAB73039924bF1B9e510329a39C9ef0c730039D');
  const gasLimit = 2000000;
  const fixedPrice = 80;
  var privateKey = '1a747a0072cbf3d492f0bdd90ca708bf0c003df9f1fc035cc09f39395ab3f1a3'
  web3.eth.accounts.wallet.add('0x' + privateKey);

  // Build a new variable based on the Web3 API including the ABI and address of the contract
  var ContractVietTestToken = new web3.eth.Contract(abiVietTestToken, contractAddr);
  var ContractTokenB = new web3.eth.Contract(abiTokenB, contractAddrTokenB);
  var ContractSwapToken = new web3.eth.Contract(abiAddrSwapContract, contractAddrSwapToken);

  // t = await ContractSwapToken.methods.setAddressTokenA(contractAddr)
  // t2 = await ContractSwapToken.methods.setAddressTokenB(contractAddrTokenB)
  // t3 = await ContractSwapToken.methods.setFixedPrice(fixedPrice)

  var mint = ContractTokenB.methods.mint(contractAddrSwapToken);
  var encodedABI = mint.encodeABI();
  var tx = {
    from: addr,
    to: contractAddrTokenB,
    gas: gasLimit,
    data: encodedABI
  };
  var signed = await web3.eth.accounts.signTransaction(tx, privateKey)
  var signedTransaction = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  console.log("Completed Mint with blockHash: " + signedTransaction.blockHash)


  var approve = await ContractVietTestToken.methods.approve(contractAddrSwapToken, 10000).send({
    from: addr,
    gas: gasLimit
  });
  console.log("Completed Approve with blockHash: " + approve.blockHash)


  await getBalance(contractAddrTokenB, contractAddrSwapToken);

  var swapToken = await ContractSwapToken.methods.SwapTokenAToB(100)
  var encodedABI = swapToken.encodeABI();
  var tx = {
    from: addr,
    to: contractAddrSwapToken,
    gas: gasLimit,
    data: encodedABI
  };
  var signed = await web3.eth.accounts.signTransaction(tx, privateKey)
  var signedTransaction = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  console.log("Completed Swap with blockHash: " + signedTransaction.blockHash)
  await getBalance(contractAddrTokenB, contractAddrSwapToken);
}

async function getBalance(contractAddrTokenB, contractAddrSwapToken){
  await web3.eth.call({
    to: contractAddrTokenB, // Contract address, used call the token balance of the address in question
    data: ('0x70a08231000000000000000000000000' + (contractAddrSwapToken).substring(2)) // Combination of contractData and tknAddress, required to call the balance of an address 
  }, function (err, result) {
    if (result) {
      var tokens = web3.utils.toBN(result).toString(); // Convert the result to a usable number string
      console.log('Tokens Owned: ' + web3.utils.fromWei(tokens, 'ether')); // Change the string to be in Ether not Wei, and show it in the console
    }
    else {
      console.log(err); // Dump errors here
    }
  });
}

main()
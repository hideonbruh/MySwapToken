async function main() {
    const [deployer] = await ethers.getSigners();

    const Migrations = await ethers.getContractFactory("Migrations");
    const migrations = await Migrations.deploy();

    console.log("Migrations address:", migrations.address);
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
  
    console.log("Token address:", token.address);

    const EtherSwap = await ethers.getContractFactory("EtherSwap");
    const etherSwap = await EtherSwap.deploy(token);

    console.log("EtherSwap address:", etherSwap.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
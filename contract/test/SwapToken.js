const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Swap Token", function () {
  let owner;
  let user;
  let tokenA;
  let tokenB;
  let swap;
  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const ERC20TokenA = await ethers.getContractFactory("VietTestToken", owner);
    tokenA = await ERC20TokenA.deploy();

    const ERC20TokenB = await ethers.getContractFactory("TokenB", owner);
    tokenB = await ERC20TokenB.deploy();

    const SwapToken = await ethers.getContractFactory("SwapContract", owner);
    swap = await SwapToken.deploy();

    await tokenA.connect(owner).transfer(user.address,2000);
    await tokenB.connect(owner).mint(swap.address);
    tokenA.connect(user).approve(swap.address, 10000);

    const blTokenA = await tokenA.balanceOf(user.address);
    console.log("Balance [%s] of Contract TokenA: %d",user.address,blTokenA);

    await swap.connect(owner).setAddressTokenA(tokenA.address);
    await swap.connect(owner).setAddressTokenB(tokenB.address);
    await swap.connect(owner).setFixedPrice(80);
  });
  describe("Swap contract", function () {
    it("Swap token 100 A to get 80 token B", async function () {
      await swap.connect(user).SwapTokenAToB(100);
      const output = await tokenB.balanceOf(user.address);
      expect(output).to.equal(80);
    });
    it("Contract doesn't have enough token", async function () {
      expect(swap.connect(user).SwapTokenAToB(1500)).to.be.revertedWith(
        "Contract doesn't have enough token"
      );
    });
  });
});

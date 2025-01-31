const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AITU_SE2324_KV", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("AITU_SE2324_KV");
    const token = await Token.deploy(1000);
    return { token, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should assign the initial supply to the owner", async function () {
      const { token, owner } = await deployTokenFixture();
      const ownerBalance = await token.balanceOf(owner.address);
      const decimals = await token.decimals();
      expect(ownerBalance).to.equal(BigInt(1000) * BigInt(10) ** BigInt(decimals));
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { token, owner, addr1 } = await deployTokenFixture();
      await token.transfer(addr1.address, 100);
      expect(await token.balanceOf(addr1.address)).to.equal(100);
    });

    it("Should allow transferFrom with approval", async function () {
      const { token, owner, addr1, addr2 } = await deployTokenFixture();
      await token.approve(addr1.address, 50);
      await token.connect(addr1).transferFrom(owner.address, addr2.address, 50);
      expect(await token.balanceOf(addr2.address)).to.equal(50);
    });
  });

  describe("Transaction Info", function () {
    it("Should return the correct latest transaction sender", async function () {
      const { token, owner, addr1 } = await deployTokenFixture();
      await token.transfer(addr1.address, 100);
      expect(await token.getTransactionSender()).to.equal(owner.address);
    });

    it("Should return the correct latest transaction receiver", async function () {
      const { token, owner, addr1 } = await deployTokenFixture();
      await token.transfer(addr1.address, 100);
      expect(await token.getTransactionReceiver()).to.equal(addr1.address);
    });
  });
});

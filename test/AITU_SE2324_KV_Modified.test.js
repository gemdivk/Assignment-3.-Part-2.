const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AITU_SE2324_KV_Modified", function () {
  async function deployModifiedTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("AITU_SE2324_KV_Modified");
    const token = await Token.deploy(1000, owner.address);
    return { token, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      const { token, owner } = await deployModifiedTokenFixture();
      expect(await token.owner()).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { token, owner, addr1 } = await deployModifiedTokenFixture();
      await token.transfer(addr1.address, 100);
      expect(await token.balanceOf(addr1.address)).to.equal(100);
    });

    it("Should allow transferFrom with approval", async function () {
      const { token, owner, addr1, addr2 } = await deployModifiedTokenFixture();
      await token.approve(addr1.address, 50);
      await token.connect(addr1).transferFrom(owner.address, addr2.address, 50);
      expect(await token.balanceOf(addr2.address)).to.equal(50);
    });
  });

  describe("Ownership", function () {
    it("Should allow only the owner to mint new tokens", async function () {
      const { token, owner, addr1 } = await deployModifiedTokenFixture();
      await expect(token.connect(addr1).mint(addr1.address, 500)).to.be.reverted;
    });
  });

  describe("Transaction Info", function () {
    it("Should return the correct latest transaction timestamp", async function () {
      const { token, owner, addr1 } = await deployModifiedTokenFixture();
      await token.transfer(addr1.address, 100);
      expect(await token.getLatestTransactionTimestamp()).to.be.a("bigint");
    });
  });
});

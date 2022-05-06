const { expect } = require("chai");
const { ethers } = require("hardhat");


//doesnt work for some reason
describe("BPTToken", function () {
  it("Should mint and transfer an NFT to someone", async function () {
    const BPTToken = await ethers.getContractFactory("BPTToken");
    const bpttoken = await BPTToken.deploy();
    await bpttoken.deployed();

    const recipient = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    const metadataURI = 'cid/test.png';

    let balance = await bpttoken.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await bpttoken.payToMint(recipient, metadataURI, {value: ethers.utils.parseEther('0.01') });

    // wait until the transaction is mined
    await newlyMintedToken.wait();

    balance = await bpttoken.balanceOf(recipient);
    expect(balance).to.equal(1);

    expect(await bpttoken.isContentOwned(metadataURI)).to.equal(true);

  });
});

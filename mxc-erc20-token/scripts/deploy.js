const { ethers } = require("hardhat");
  
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer: ", deployer.address);

  const ownerAddress = "";
  // Deploy MXC Token contract
  const MXC = await ethers.getContractFactory("MXC");
  const MXCContract = await MXC.deploy(ownerAddress);
  await MXCContract.deployed();
  console.log(MXCContract.address);
}
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  
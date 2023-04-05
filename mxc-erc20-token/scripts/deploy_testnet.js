const { ethers } = require("hardhat");
  
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer: ", deployer.address);

  // Deploy MXC Token contract
  const MXC = await ethers.getContractFactory("MXC");
  const MXCContract = await MXC.deploy();
  await MXCContract.deployed();
  console.log(MXCContract.address);
}
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  
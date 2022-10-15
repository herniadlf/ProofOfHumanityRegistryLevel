const { ethers, network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

async function CoreMockRegister() {
    const chainId = network.config.chainId.toString();
    const pohCoreContract = await ethers.getContractAt(
        networkConfig.coreRegistry[chainId].contract,
        networkConfig.coreRegistry[chainId].address
    );
    const user = (await ethers.getSigners())[1];
    await pohCoreContract.connect(user).addSubmission("string_1", "string_2");
    const isRegistered = await pohCoreContract.connect(user).isRegistered(user.address);
    console.log(`the user ${user.address} is registered? ${isRegistered.toString()}`);
}

CoreMockRegister()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

const { network, ethers } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

async function softRegister() {
    const chainId = network.config.chainId.toString();
    const pohSoftContract = await ethers.getContractAt(
        networkConfig.softRegistry[chainId].contract,
        networkConfig.softRegistry[chainId].address
    );
    const user = (await ethers.getSigners())[1];
    await pohSoftContract.connect(user).addSubmission(ethers.constants.AddressZero);
    const isRegisteredSoft = await pohSoftContract.connect(user).isRegistered(user.address);
    console.log(`is registered soft ${isRegisteredSoft}`);
}

softRegister()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

const {
    developmentChains,
    networkConfig,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { ethers, network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    const pohCoreAddress = await getPohCoreAddress(deploy, deployer);
    const pohSoftAddress = await getPohSoftAddress();
    const arguments = [pohCoreAddress, pohSoftAddress];

    const pohLevel = await deploy("ProofOfHumanityLevel", {
        from: deployer,
        args: arguments,
        waitConfirmations: waitBlockConfirmations,
    });

    console.log(
        `The PoHLevel contract was deployed at ${pohLevel.address} with pohCore ${pohCoreAddress} and pohSoft ${pohSoftAddress}`
    );
};

async function getPohCoreAddress(deploy, deployer) {
    if (developmentChains.includes(network.name)) {
        const pohCoreContract = await deploy("PoHMock", { from: deployer, arguments: [] });
        return pohCoreContract.address;
    }
    return networkConfig[network.config.chainId].pohCoreAddress;
}

async function getPohSoftAddress() {
    return (await ethers.getContract("ProofOfHumanitySoft")).address;
}

module.exports.tags = ["all", "poh-level"];

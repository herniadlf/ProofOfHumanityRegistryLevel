const {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    await deploy("ProofOfHumanitySoft", {
        from: deployer,
        arguments: [],
        waitConfirmations: waitBlockConfirmations,
    });
};

module.exports.tags = ["all", "poh-soft"];

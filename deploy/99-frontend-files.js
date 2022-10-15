const {
    frontEndPOHLevelContractsFile,
    frontEndPOHSoftContractsFile,
    frontEndAbiLocation,
} = require("../helper-hardhat-config");
require("dotenv").config();
const fs = require("fs");
const { network } = require("hardhat");

module.exports = async () => {
    if (process.env.UPDATE_FRONTEND_FILES) {
        console.log("Writing to front end...");
        await updatePOHLevelContractAddresses();
        await updatePOHSoftAddresses();
        await updateAbi();
        console.log("Front end written!");
    }
};

async function updateAbi() {
    const proofOfHumanityLevelContract = await ethers.getContract("ProofOfHumanityLevel");
    fs.writeFileSync(
        `${frontEndAbiLocation}ProofOfHumanityLevel.json`,
        proofOfHumanityLevelContract.interface.format(ethers.utils.FormatTypes.json)
    );

    const proofOfHumanitySoftcontract = await ethers.getContract("ProofOfHumanitySoft");
    fs.writeFileSync(
        `${frontEndAbiLocation}ProofOfHumanitySoft.json`,
        proofOfHumanitySoftcontract.interface.format(ethers.utils.FormatTypes.json)
    );
}

async function updatePOHLevelContractAddresses() {
    const chainId = network.config.chainId.toString();
    const proofOfHumanityLevelContract = await ethers.getContract("ProofOfHumanityLevel");
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndPOHLevelContractsFile, "utf8"));
    if (chainId in contractAddresses && contractAddresses[chainId]["ProofOfHumanityLevel"]) {
        if (
            !contractAddresses[chainId]["ProofOfHumanityLevel"].includes(
                proofOfHumanityLevelContract.address
            )
        ) {
            contractAddresses[chainId]["ProofOfHumanityLevel"].push(
                proofOfHumanityLevelContract.address
            );
        }
    } else {
        contractAddresses[chainId] = {
            ProofOfHumanityLevel: [proofOfHumanityLevelContract.address],
        };
    }
    fs.writeFileSync(frontEndPOHLevelContractsFile, JSON.stringify(contractAddresses));
}

async function updatePOHSoftAddresses() {
    const chainId = network.config.chainId.toString();
    const proofOfHumanitySoftContract = await ethers.getContract("ProofOfHumanitySoft");
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndPOHSoftContractsFile, "utf8"));
    if (chainId in contractAddresses && contractAddresses[chainId]["ProofOfHumanitySoft"]) {
        if (
            !contractAddresses[chainId]["ProofOfHumanitySoft"].includes(
                proofOfHumanitySoftContract.address
            )
        ) {
            contractAddresses[chainId]["ProofOfHumanitySoft"].push(
                proofOfHumanitySoftContract.address
            );
        }
    } else {
        contractAddresses[chainId] = {
            ProofOfHumanitySoft: [proofOfHumanitySoftContract.address],
        };
    }
    fs.writeFileSync(frontEndPOHSoftContractsFile, JSON.stringify(contractAddresses));
}

module.exports.tags = ["all", "frontend"];

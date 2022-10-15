const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "localhost",
    },
    softRegistry: {
        31337: {
            contract: "ProofOfHumanitySoft",
            address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        },
    },
    coreRegistry: {
        31337: {
            contract: "PoHMock",
            address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        },
    },
    pohLevel: {
        31337: {
            contract: "ProofOfHumanityLevel",
            address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        },
    },
};
const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
const frontEndPOHLevelContractsFile = "../pohlevel-frontend/constants/pohLevelMapping.json";
const frontEndPOHSoftContractsFile = "../pohlevel-frontend/constants/pohSoftMapping.json";
const frontEndAbiLocation = "../pohlevel-frontend/constants/";

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    frontEndPOHLevelContractsFile,
    frontEndPOHSoftContractsFile,
    frontEndAbiLocation,
};

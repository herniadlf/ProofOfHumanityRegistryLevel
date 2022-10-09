require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");

module.exports = {
    solidity: "0.8.10",
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        localhost: {
            chainId: 31337,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
};

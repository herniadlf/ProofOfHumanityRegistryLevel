require("@nomiclabs/hardhat-waffle")

module.exports = {
    solidity: "0.8.10",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        localhost: {
            chainId: 31337,
        }
    },
}

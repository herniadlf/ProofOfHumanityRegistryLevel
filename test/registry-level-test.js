const { expect } = require('chai');
const { ethers } = require('hardhat');
const ERRORS = require('./helpers/errors');


describe('Registry Level Contract', function() {

    let contractFactory, ethersProvider, deployer, userOne, userTwo, userThree;

    beforeEach(async function() {
        contractFactory = await ethers.getContractFactory('RegistryLevel');
        accounts = await ethers.getSigners();
        ethersProvider = ethers.provider;
        deployer = accounts[0];
        userOne = accounts[1];
        userTwo = accounts[2];
        userThree = accounts[4];
    });

    describe('Deployment', function(){
        it('should fail for invalid address', async function() {
            const deployTx = contractFactory.deploy(ethers.constants.AddressZero);
            await expect(deployTx).to.be.revertedWith(ERRORS.INIT_PARAMS_INVALID);
        });

        it('should work for a valid address', async function() {
            const deployTx = await contractFactory.deploy(userOne.getAddress());
    
            expect(deployTx.deployed()).to.not.be.reverted;
        });
    });


});
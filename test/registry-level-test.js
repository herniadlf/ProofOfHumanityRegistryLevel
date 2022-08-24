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

    describe('Change Proof Of Humanity', function(){

        let registryLevelContract, firstPoHContract, secondPoHContract;

        beforeEach(async function(){
            const pohContractFactory = await ethers.getContractFactory('PoHMock');
            firstPoHContract = await pohContractFactory.deploy();
            await firstPoHContract.deployed();

            secondPoHContract = await pohContractFactory.deploy();
            await secondPoHContract.deployed();
        });

        it('ProofOfHumanity should be the first contract', async function() {
            registryLevelContract = await contractFactory.deploy(firstPoHContract.address);
            await registryLevelContract.deployed()

            const proofOfHumanity = await registryLevelContract.proofOfHumanity();

            expect(proofOfHumanity).to.be.eq(firstPoHContract.address);
        });

        it('ProofOfHumanity should change to the second contract', async function() {
            registryLevelContract = await contractFactory.deploy(firstPoHContract.address);
            await registryLevelContract.deployed()

            await registryLevelContract.changeProofOfHumanity(secondPoHContract.address);
            const proofOfHumanity = await registryLevelContract.proofOfHumanity();

            expect(proofOfHumanity).to.be.eq(secondPoHContract.address);
        });
    });

    describe('Act as Proxy with a valid Proof Of Humanity contract', function(){

        let registryLevelContract, pohContract;

        beforeEach(async function(){
            const pohContractFactory = await ethers.getContractFactory('PoHMock');
            pohContract = await pohContractFactory.deploy();
            await pohContract.deployed();
            
            registryLevelContract = await contractFactory.deploy(pohContract.address);
            await registryLevelContract.deployed()
        });

        it('should be the same registry asking through the proxy', async function() {
            await pohContract.connect(userOne).addSubmission();

            expect(await pohContract.isRegistered(userOne.address)).to.equal(true);
            expect(await registryLevelContract.isRegistered(userOne.address)).to.equal(true);
        });
    });

});
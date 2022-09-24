const { expect } = require('chai');
const { ethers } = require('hardhat');
const ERRORS = require('./helpers/errors');


describe('Proof Of Humanity Proxy Contract', function() {

    let contractFactory, provider, deployer, userOne, userTwo, userThree;

    beforeEach(async function() {
        contractFactory = await ethers.getContractFactory('ProofOfHumanityProxy');
        
        accounts = await ethers.getSigners();
        provider = ethers.provider;
        deployer = accounts[0];
        userOne = accounts[1];
        userTwo = accounts[2];
        userThree = accounts[4];
    });

    describe('Deployment', function() {
        it('should work for valid addresses', async function() {
            const deployTx = await contractFactory.deploy(userOne.getAddress(), userTwo.getAddress());
    
            expect(deployTx.deployed()).to.not.be.reverted;
        });
    });

    describe('Change Governor', function() {

        let proofOfHumanityProxyContract;

        beforeEach(async function(){
            const pohContractFactory = await ethers.getContractFactory('PoHMock');
            const pohContract = await pohContractFactory.deploy();
            await pohContract.deployed();
            
            proofOfHumanityProxyContract = await contractFactory.deploy(pohContract.address, pohContract.address);
            await proofOfHumanityProxyContract.deployed()
        });

        it('should fail to change the contract governor', async function() {
            await expect(proofOfHumanityProxyContract.connect(userOne).changeGovernor(userOne.address))
                .to.be.revertedWith(ERRORS.ONLY_GOVERNOR_TRANSACTION);
        });

        it('should change the contract governor ok', async function() {
            const tx = await proofOfHumanityProxyContract.changeGovernor(userOne.address);
            await expect(tx).to.emit(proofOfHumanityProxyContract, 'GovernorChanged').withArgs(userOne.address);
        });

    });

    describe('Change Proof Of Humanity', function() {

        let proofOfHumanityProxyContract, firstPoHContract, secondPoHContract, thirdPohContract;

        beforeEach(async function(){
            const pohContractFactory = await ethers.getContractFactory('PoHMock');
            firstPoHContract = await pohContractFactory.deploy();
            await firstPoHContract.deployed();

            secondPoHContract = await pohContractFactory.deploy();
            await secondPoHContract.deployed();

            thirdPohContract = await pohContractFactory.deploy();
            await thirdPohContract.deployed();

            proofOfHumanityProxyContract = await contractFactory.deploy(firstPoHContract.address, secondPoHContract.address);
            await proofOfHumanityProxyContract.deployed()
        });

        it('ProofOfHumanity core should change to the third contract', async function() {
            const tx = await proofOfHumanityProxyContract.changeProofOfHumanityCore(thirdPohContract.address);
            const proofOfHumanityCore = await proofOfHumanityProxyContract.proofOfHumanityCore();
            
            await expect(tx).to.emit(proofOfHumanityProxyContract, 'ProofOfHumanityCoreChanged').withArgs(thirdPohContract.address);
            expect(proofOfHumanityCore).to.be.eq(thirdPohContract.address);
        });

        it('ProofOfHumanity soft should change to the third contract', async function() {
            const tx = await proofOfHumanityProxyContract.changeProofOfHumanitySoft(thirdPohContract.address);
            const proofOfHumanitySoft = await proofOfHumanityProxyContract.proofOfHumanitySoft();
            
            await expect(tx).to.emit(proofOfHumanityProxyContract, 'ProofOfHumanitySoftChanged').withArgs(thirdPohContract.address);
            expect(proofOfHumanitySoft).to.be.eq(thirdPohContract.address);
        });

        it('should fail becase the sender is not the governor change to the third contract', async function() {
            await expect(proofOfHumanityProxyContract.connect(userOne).changeProofOfHumanityCore(thirdPohContract.address))
                .to.be.revertedWith(ERRORS.ONLY_GOVERNOR_TRANSACTION);
                await expect(proofOfHumanityProxyContract.connect(userOne).changeProofOfHumanitySoft(thirdPohContract.address))
                .to.be.revertedWith(ERRORS.ONLY_GOVERNOR_TRANSACTION);
        });
    });

    describe('Act as Proxy with a valid Proof Of Humanity contract', function() {

        let proofOfHumanityProxyContract, pohCoreContract, pohSoftContract, pohContractFactory;

        beforeEach(async function(){
            pohContractFactory = await ethers.getContractFactory('PoHMock');
            pohCoreContract = await pohContractFactory.deploy();
            await pohCoreContract.deployed();
            pohSoftContract = await pohContractFactory.deploy();
            await pohSoftContract.deployed();
            
            proofOfHumanityProxyContract = await contractFactory.deploy(pohCoreContract.address, pohSoftContract.address);
            await proofOfHumanityProxyContract.deployed()
        });

        it('should be the same registry asking through the proxy', async function() {
            await pohCoreContract.connect(userOne).addSubmission('evidence', 'name');

            expect(await pohCoreContract.isRegistered(userOne.address)).to.equal(true);
            expect(await proofOfHumanityProxyContract.isRegistered(userOne.address)).to.equal(true);
            expect(await pohSoftContract.isRegistered(userOne.address)).to.equal(false);
            expect(await pohCoreContract.isRegistered(userTwo.address)).to.equal(false);
            expect(await proofOfHumanityProxyContract.isRegistered(userTwo.address)).to.equal(false);
        });

        it('should be the another registry if there is a changeProofOfHumanity transaction first', async function() {
            await pohCoreContract.connect(userOne).addSubmission('evidence', 'name');
            const anotherPoHCoreContract = await pohContractFactory.deploy();
            await anotherPoHCoreContract.deployed();
            await proofOfHumanityProxyContract.changeProofOfHumanityCore(anotherPoHCoreContract.address);
            expect(await pohCoreContract.isRegistered(userOne.address)).to.equal(true);
            expect(await anotherPoHCoreContract.isRegistered(userOne.address)).to.equal(false);
            expect(await proofOfHumanityProxyContract.isRegistered(userOne.address)).to.equal(false);
        });
    });

    describe('Act as proxy with submissions on soft contract', function() {

        let proofOfHumanityProxyContract, pohCoreContract, pohSoftContract, pohContractFactory;

        beforeEach(async function(){
            pohContractFactory = await ethers.getContractFactory('PoHMock');
            pohCoreContract = await pohContractFactory.deploy();
            await pohCoreContract.deployed();
            pohSoftContract = await pohContractFactory.deploy();
            await pohSoftContract.deployed();
            
            proofOfHumanityProxyContract = await contractFactory.deploy(pohCoreContract.address, pohSoftContract.address);
            await proofOfHumanityProxyContract.deployed()
        });

        it('isRegistered should return false if the submissions is in the soft registry', async function() {
            await pohSoftContract.connect(userOne).addSubmission('evidence', 'name');

            expect(await pohCoreContract.isRegistered(userOne.address)).to.equal(false);
            expect(await pohSoftContract.isRegistered(userOne.address)).to.equal(true);
            expect(await proofOfHumanityProxyContract.isRegistered(userOne.address)).to.equal(false);
        });

        it('isRegistered should return false although it in the core registry', async function() {
            await pohSoftContract.connect(userOne).addSubmission('evidence', 'name');
            expect(await proofOfHumanityProxyContract.isRegistered(userOne.address)).to.equal(false);
            await pohCoreContract.connect(userOne).addSubmission('evidence', 'name');
            expect(await pohCoreContract.isRegistered(userOne.address)).to.equal(true);
            expect(await proofOfHumanityProxyContract.isRegistered(userOne.address)).to.equal(false);
        });

        it('isSoftRegistered should return true if its in both registries', async function() {
            await pohSoftContract.connect(userOne).addSubmission('evidence', 'name');
            await pohCoreContract.connect(userOne).addSubmission('evidence', 'name');
            expect(await proofOfHumanityProxyContract.isSoftRegistered(userOne.address)).to.equal(true);
        });

        it('isSoftRegistered should return false if its in the soft registry alone', async function() {
            await pohSoftContract.connect(userOne).addSubmission('evidence', 'name');
            expect(await proofOfHumanityProxyContract.isSoftRegistered(userOne.address)).to.equal(false);
        });
    })

});
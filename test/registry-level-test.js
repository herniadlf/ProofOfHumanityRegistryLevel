const { expect } = require('chai');
const { ethers } = require('hardhat');
const ERRORS = require('./helpers/errors');


describe('Proof Of Humanity Proxy Contract', function() {

    let contractFactory, ethersProvider, deployer, userOne, userTwo, userThree;

    beforeEach(async function() {
        contractFactory = await ethers.getContractFactory('ProofOfHumanityProxy');
        accounts = await ethers.getSigners();
        ethersProvider = ethers.provider;
        deployer = accounts[0];
        userOne = accounts[1];
        userTwo = accounts[2];
        userThree = accounts[4];
    });

    describe('Deployment', function() {
        it('should fail for invalid address', async function() {
            const deployTx = contractFactory.deploy(ethers.constants.AddressZero);
            await expect(deployTx).to.be.revertedWith(ERRORS.INIT_PARAMS_INVALID);
        });

        it('should work for a valid address', async function() {
            const deployTx = await contractFactory.deploy(userOne.getAddress());
    
            expect(deployTx.deployed()).to.not.be.reverted;
        });
    });

    describe('Change Governor', function() {

        let proofOfHumanityProxyContract;

        beforeEach(async function(){
            const pohContractFactory = await ethers.getContractFactory('PoHMock');
            const pohContract = await pohContractFactory.deploy();
            await pohContract.deployed();
            
            proofOfHumanityProxyContract = await contractFactory.deploy(pohContract.address);
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

        let proofOfHumanityProxyContract, firstPoHContract, secondPoHContract;

        beforeEach(async function(){
            const pohContractFactory = await ethers.getContractFactory('PoHMock');
            firstPoHContract = await pohContractFactory.deploy();
            await firstPoHContract.deployed();

            secondPoHContract = await pohContractFactory.deploy();
            await secondPoHContract.deployed();
        });

        it('ProofOfHumanity should be the first contract', async function() {
            proofOfHumanityProxyContract = await contractFactory.deploy(firstPoHContract.address);
            await proofOfHumanityProxyContract.deployed()

            const proofOfHumanity = await proofOfHumanityProxyContract.proofOfHumanity();

            expect(proofOfHumanity).to.be.eq(firstPoHContract.address);
        });

        it('ProofOfHumanity should change to the second contract', async function() {
            proofOfHumanityProxyContract = await contractFactory.deploy(firstPoHContract.address);
            await proofOfHumanityProxyContract.deployed()

            const tx = await proofOfHumanityProxyContract.changeProofOfHumanity(secondPoHContract.address);
            const proofOfHumanity = await proofOfHumanityProxyContract.proofOfHumanity();
            
            await expect(tx).to.emit(proofOfHumanityProxyContract, 'ProofOfHumanityChanged').withArgs(secondPoHContract.address);
            expect(proofOfHumanity).to.be.eq(secondPoHContract.address);
        });
    });

    describe('Act as Proxy with a valid Proof Of Humanity contract', function() {

        let proofOfHumanityProxyContract, pohContract, pohContractFactory;

        beforeEach(async function(){
            pohContractFactory = await ethers.getContractFactory('PoHMock');
            pohContract = await pohContractFactory.deploy();
            await pohContract.deployed();
            
            proofOfHumanityProxyContract = await contractFactory.deploy(pohContract.address);
            await proofOfHumanityProxyContract.deployed()
        });

        it('should be the same registry asking through the proxy', async function() {
            await pohContract.connect(userOne).addSubmission('evidence', 'name');

            expect(await pohContract.isRegistered(userOne.address)).to.equal(true);
            expect(await proofOfHumanityProxyContract.isRegistered(userOne.address)).to.equal(true);
            expect(await pohContract.isRegistered(userTwo.address)).to.equal(false);
            expect(await proofOfHumanityProxyContract.isRegistered(userTwo.address)).to.equal(false);
        });

        it('should be the another registry if there is a changeProofOfHumanity transaction first', async function() {
            await pohContract.connect(userOne).addSubmission('evidence', 'name');
            const secondPoHContract = await pohContractFactory.deploy();
            await secondPoHContract.deployed();
            await proofOfHumanityProxyContract.changeProofOfHumanity(secondPoHContract.address);
            expect(await pohContract.isRegistered(userOne.address)).to.equal(true);
            expect(await secondPoHContract.isRegistered(userOne.address)).to.equal(false);
            expect(await proofOfHumanityProxyContract.isRegistered(userOne.address)).to.equal(false);
        });
    });

    describe('Add one side registry', function() {

        let proofOfHumanityProxyContract, pohMainContract, pohSideContract, pohContractFactory;

        beforeEach(async function(){
            pohContractFactory = await ethers.getContractFactory('PoHMock');
            pohMainContract = await pohContractFactory.deploy();
            await pohMainContract.deployed();

            pohSideContract = await pohContractFactory.deploy();
            await pohSideContract.deployed();
            
            proofOfHumanityProxyContract = await contractFactory.deploy(pohMainContract.address);
            await proofOfHumanityProxyContract.deployed()
        });

        it('should add a sideRegistry ok', async function() {
            const tx = await proofOfHumanityProxyContract.addSideRegistry(pohSideContract.address);
            
            await expect(tx).to.emit(proofOfHumanityProxyContract, 'SideRegistryAdded').withArgs(pohSideContract.address);
        });
        
        describe('With one side registry mocked always OK added', async function() {
            beforeEach(async function() {
                await proofOfHumanityProxyContract.addSideRegistry(pohSideContract.address);
            });
            
            it('should forward a submission to the side registry', async function() {
                const tx = await proofOfHumanityProxyContract.connect(userOne)
                                    .addSideRegistrySubmission(pohSideContract.address, 'evidence', 'name');
                
                await expect(tx).to.emit(proofOfHumanityProxyContract, 'SideRegistrySubmissionAdded')
                    .withArgs(pohSideContract.address, userOne.address);
            });
        });
    })

});
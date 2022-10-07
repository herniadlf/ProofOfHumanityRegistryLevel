const { expect } = require('chai');
const { ethers } = require('hardhat');
const { ACCOUNT_ALREADY_REGISTERED } = require('./helpers/errors');


describe('Proof Of Humanity Soft Registry', function() {

    let contractFactory, userOne, userTwo, userThree;

    beforeEach(async function() {
        contractFactory = await ethers.getContractFactory('ProofOfHumanitySoft');
        
        accounts = await ethers.getSigners();
        userOne = accounts[1];
        userTwo = accounts[2];
        userThree = accounts[4];
    });

    describe('Deployment', function() {
        it('should work without arguments', async function() {
            const deployTx = await contractFactory.deploy();
    
            expect(deployTx.deployed()).to.not.be.reverted;
        });
    });

    describe('Add Submission', function() {

        let pohSoftContract, pohContractFactory;

        beforeEach(async function(){
            pohContractFactory = await ethers.getContractFactory('ProofOfHumanitySoft');
            pohSoftContract = await pohContractFactory.deploy();
            await pohSoftContract.deployed();
        });

        it('should add a submission with a managed account', async function() {
            const tx = await pohSoftContract.connect(userOne).addSubmission(userTwo.address);

            expect(await pohSoftContract.isRegistered(userOne.address)).to.equal(true);
            await expect(tx).to.emit(pohSoftContract, 'SubmissionAdded').withArgs(userOne.address, userTwo.address);
        });

        it('should add a submission without a managed account', async function() {
            const tx = await pohSoftContract.connect(userOne).addSubmission(ethers.constants.AddressZero);

            expect(await pohSoftContract.isRegistered(userOne.address)).to.equal(true);
            await expect(tx).to.emit(pohSoftContract, 'SubmissionAdded').withArgs(userOne.address, ethers.constants.AddressZero);
        });

        it('should not be registered', async function() {
            expect(await pohSoftContract.isRegistered(userOne.address)).to.equal(false);
        });

        it('should fail a second submission from the same account', async function() {
            await pohSoftContract.connect(userOne).addSubmission(ethers.constants.AddressZero);
            const secondSubmission = pohSoftContract.connect(userOne).addSubmission(ethers.constants.AddressZero);

            await expect(secondSubmission).to.be.revertedWith(ACCOUNT_ALREADY_REGISTERED);
        });
    });

});

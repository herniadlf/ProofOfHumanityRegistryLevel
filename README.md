# ProofOfHumanityRegistryLevel

This contract is a proxy between the Proof of Humanity registry and any integrator.

It's composed with a base ProofOfHumanity contract and a list of N ProofOfHumanity side contracts. 

![image](doc/poh-contracts-communications.jpeg)

The PoH v1 or PoH v2 contracts are supposed to be that "base contract" or "base registry". So, the first level (level=1) is the actual registry, and any other side-registry will be 2, 3 and so on. This [HIP](https://gov.proofofhumanity.id/t/phase-1-hip-xx-explicit-account-management/2328/8) describes a way to build a side-registry (level=2) more inclusive and less strict.

## isRegistered

The actual implementation on RegistryLevel contract:

```
    /** @dev 
    * To be "registered" means that you are registered in the PoH base registry AND you aren't registered in any side registry 
    */
    function isRegistered(address _submissionID) external view returns (bool){
        bool isRegisteredOnASideRegistry = false;
        for (uint i=0; i < sideRegistries.length; i++) {
            if (sideRegistries[i].isRegistered(_submissionID)) {
                isRegisteredOnASideRegistry = true;
                break;
            }
        }
        return !isRegisteredOnASideRegistry && IProofOfHumanity(proofOfHumanity).isRegistered(_submissionID);
}
```

## Local development

Install hardhat with `npm install --save-dev hardhat`.

Run test with `npx hardhat test`
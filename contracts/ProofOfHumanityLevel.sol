//SPDX-License-Identifier: UNLICENSED
/**
 * @author: [@herniadlf]
 *  @reviewers: []
 *  @auditors: []
 *  @bounties: []
 *  @deployments: []
 *  @tools: []
 */

pragma solidity ^0.8.10;

import "./interfaces/IProofOfHumanity.sol";
import "./libraries/Errors.sol";

contract ProofOfHumanityLevel {
    
    /* Storage */
    IProofOfHumanity public proofOfHumanityCore; // The address with ProofOfHumanity registry core in which ProofOfHumanityLevel relies on. The strictest implementation.
    IProofOfHumanity public proofOfHumanitySoft; // The address with ProofOfHumanity soft registry, a simple and more inclusive implementation.
    address public governor; // The address that can invoke some governance changes in ProofOfHumanityLevel.
    
    /* Events */
    
    /** @dev Emitted when the governor change the base ProofOfHumanity registry address
     * @param _newProofOfHumanityCore the new ProofOfHumanity core contract
     */
    event ProofOfHumanityCoreChanged(IProofOfHumanity indexed _newProofOfHumanityCore);

    /** @dev Emitted when the governor change the soft ProofOfHumanity registry address
     * @param _newProofOfHumanitySoft the new ProofOfHumanity contract
     */
    event ProofOfHumanitySoftChanged(IProofOfHumanity indexed _newProofOfHumanitySoft);
    
    /** @dev Emitted when the governor is changed
     * @param _newGovernor the new Governor contract
     */
    event GovernorChanged(address indexed _newGovernor);

    /* Modifiers */

    modifier onlyGovernor() { 
        if (msg.sender != governor) revert Errors.OnlyGovernorTransaction();
        _; 
    }

    /** @dev constructor
     * @param _proofOfHumanityCore The core ProofOfHumanity contract, the base contract for the ProofOfHumanityLevel.
     * @param _proofOfHumanitySoft The soft ProofOfHumanity contract.
    */
    constructor(IProofOfHumanity _proofOfHumanityCore, IProofOfHumanity _proofOfHumanitySoft) {
        proofOfHumanityCore = _proofOfHumanityCore;
        proofOfHumanitySoft = _proofOfHumanitySoft;
        governor = msg.sender;
    }

    /* External and public */

    /** @dev
     * @param _newProofOfHumanityCore Change for another implementation of ProofOfHumanity core. It should follow the IProofOfHumanity interface.
     */
    function changeProofOfHumanityCore(IProofOfHumanity _newProofOfHumanityCore) external onlyGovernor {
        proofOfHumanityCore = _newProofOfHumanityCore;
        emit ProofOfHumanityCoreChanged(_newProofOfHumanityCore);
    }

    /** @dev
     * @param _newProofOfHumanitySoft Change for another implementation of ProofOfHumanity soft. It should follow the IProofOfHumanity interface.
     */
    function changeProofOfHumanitySoft(IProofOfHumanity _newProofOfHumanitySoft) external onlyGovernor {
        proofOfHumanitySoft = _newProofOfHumanitySoft;
        emit ProofOfHumanitySoftChanged(_newProofOfHumanitySoft);
    }

    /** @dev
     * @param _newGovernor Change for another governance address.
     */
    function changeGovernor(address _newGovernor) external onlyGovernor {
        governor = _newGovernor;
        emit GovernorChanged(_newGovernor);
    }

    /** @dev 
     * To be "registered" means that you are registered in the PoH core registry AND you aren't registered in the soft registry 
     */
    function isRegistered(address _submissionID) external view returns (bool){
        return !proofOfHumanitySoft.isRegistered(_submissionID) && proofOfHumanityCore.isRegistered(_submissionID);
    }

    /** @dev 
     * To be "soft registered" means that you are registered in the PoH core registry AND you are in the soft registry 
     */
    function isSoftRegistered(address _submissionID) external view returns (bool){
        return proofOfHumanitySoft.isRegistered(_submissionID) && proofOfHumanityCore.isRegistered(_submissionID);
    }

}
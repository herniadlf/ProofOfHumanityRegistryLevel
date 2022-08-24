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

contract RegistryLevel is IProofOfHumanity {
    /* Structs */
    /* Storage */
    address public proofOfHumanity; // The address with ProofOfHumanity registry in which RegistryLevel relies on.
    address public governor; // The address that can invoke some governance changes in RegistryLevel
    /* Events */
    /* Modifiers */

    modifier onlyGovernor() { 
        if (msg.sender != governor) revert Errors.OnlyGovernorTransaction();
        _; 
    }

    /** @dev constructor
     * @param _proofOfHumanity The ProofOfHumanity contract, the base contract for the RegistryLevel
    */
    constructor(address _proofOfHumanity) {
        if (_proofOfHumanity == address(0)) revert Errors.InitParamsInvalid();
        proofOfHumanity = _proofOfHumanity;
        governor = msg.sender;
    }

    /* External and public */

    /** @dev
     * @param _newProofOfHumanity Change for another implementation of ProofOfHumanity. It should follow the IProofOfHumanity interface.
     */
    function changeProofOfHumanity(address _newProofOfHumanity) external onlyGovernor {
        proofOfHumanity = _newProofOfHumanity;
    }

    /** @dev
     * @param _newGovernor Change for another governance address.
     */
    function changeGovernor(address _newGovernor) external onlyGovernor {
        governor = _newGovernor;
    }

    /** @dev
     * @inheritdoc IProofOfHumanity
     */
    function isRegistered(address _submissionID) external view returns (bool){
        return IProofOfHumanity(proofOfHumanity).isRegistered(_submissionID);
    }

}
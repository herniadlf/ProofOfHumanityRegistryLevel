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
    address public proofOfHumanity;
    /* Events */
    /* Modifiers */

    /** @dev constructor
     * @param _proofOfHumanity The ProofOfHumanity contract, the base contract for the RegistryLevel
    */
    constructor(address _proofOfHumanity) {
        if (_proofOfHumanity == address(0)) revert Errors.InitParamsInvalid();
        proofOfHumanity = _proofOfHumanity;
    }

    /* External and public */

    /** @dev
     * @param _newProofOfHumanity Change for another implementation of ProofOfHumanity. It should follow the IProofOfHumanity interface.
     */
    function changeProofOfHumanity(address _newProofOfHumanity) external {
        proofOfHumanity = _newProofOfHumanity;
    }

    /** @dev
     * @inheritdoc IProofOfHumanity
     */
    function isRegistered(address _submissionID) external view returns (bool){
        return IProofOfHumanity(proofOfHumanity).isRegistered(_submissionID);
    }

}
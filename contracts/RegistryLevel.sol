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

contract RegistryLevel {
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
    function changeProofOfHumanity(address _newProofOfHumanity) external {
        proofOfHumanity = _newProofOfHumanity;
    }

}
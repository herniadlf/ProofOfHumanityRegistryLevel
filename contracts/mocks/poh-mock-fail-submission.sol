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

import "../interfaces/IProofOfHumanity.sol";

contract PoHMockFailSubmission is IProofOfHumanity {

    mapping(address => bool) fakeRegistry;

    function addSubmission(string calldata, string calldata) external{
        if (true) {
            revert("some error");
        }
        fakeRegistry[msg.sender] = true;
    }

    function isRegistered(address _submissionID) external view returns (bool){
        if (true) {
            revert("some error");
        }
        return fakeRegistry[_submissionID];
    }
}
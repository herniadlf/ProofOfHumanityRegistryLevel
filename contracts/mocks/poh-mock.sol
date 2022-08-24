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

contract PoHMock is IProofOfHumanity {

    mapping(address => bool) fakeRegistry;

    function addSubmission() external {
        fakeRegistry[msg.sender] = true;
    }

    function isRegistered(address _submissionID) external view returns (bool){
        return fakeRegistry[_submissionID];
    }
}
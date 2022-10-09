//SPDX-License-Identifier: MIT
/**
 * @author: [@herniadlf]
 *  @reviewers: []
 *  @auditors: []
 *  @bounties: []
 *  @deployments: []
 *  @tools: []
 */

pragma solidity ^0.8.10;

contract ProofOfHumanitySoft {
    /* Errors */
    error AccountAlreadyRegistered();

    /* Structs */
    struct SoftRegistry {
        address managedBy;
        bool isRegistered;
    }

    /* Events */
    event SubmissionAdded(address indexed _submissionId, address indexed _accountInControl);

    /* Storage */
    mapping(address => SoftRegistry) public softRegistry;

    /** @dev Return true if the submission is registered.
     *  @param _submissionID The address of the submission.
     *  @return Whether the submission is registered or not.
     */
    function isRegistered(address _submissionID) external view returns (bool) {
        return softRegistry[_submissionID].isRegistered;
    }

    /** @dev Make a request to add a new entry to the list.
     *  @param _accountInControl The account that it's in control of msg.sender submission
     */
    function addSubmission(address _accountInControl) external {
        if (softRegistry[msg.sender].isRegistered) {
            revert AccountAlreadyRegistered();
        }
        softRegistry[msg.sender] = SoftRegistry(_accountInControl, true);
        emit SubmissionAdded(msg.sender, _accountInControl);
    }
}

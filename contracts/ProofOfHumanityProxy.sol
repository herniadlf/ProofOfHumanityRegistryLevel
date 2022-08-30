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

contract ProofOfHumanityProxy {
    /* Structs */
    /* Storage */
    address public proofOfHumanity; // The address with ProofOfHumanity registry in which ProofOfHumanityProxy relies on.
    address public governor; // The address that can invoke some governance changes in ProofOfHumanityProxy.
    mapping(address => IProofOfHumanity) public addressToSideRegistry; // The mapping that facilitates access to sideRegistries.
    mapping(address => bool) public submissionToSideRegistry; // The mapping that easily flags an address as a member of a side-registry.
    
    /* Events */
    
    /** @dev Emitted when the governor change the base ProofOfHumanity registry address
     * @param _newProofOfHumanity the new ProofOfHumanity contract
     */
    event ProofOfHumanityChanged(address indexed _newProofOfHumanity);
    
    /** @dev Emitted when the governor is changed
     * @param _newGovernor the new Governor contract
     */
    event GovernorChanged(address indexed _newGovernor);

    /** @dev Emitted when a side registry is added
     * @param _newSideRegistry the new SideRegistry that implements IProofOfHumanity as a side registry
     */
    event SideRegistryAdded(address indexed _newSideRegistry);

    /** @dev Emitted when a side registry is added
     * @param _sideRegistry the SideRegistry which will store the new submission
     * @param _submissionID the submitter address
     */
    event SideRegistrySubmissionAdded(address indexed _sideRegistry, address indexed _submissionID);
    
    /* Modifiers */

    modifier onlyGovernor() { 
        if (msg.sender != governor) revert Errors.OnlyGovernorTransaction();
        _; 
    }

    /** @dev constructor
     * @param _proofOfHumanity The ProofOfHumanity contract, the base contract for the ProofOfHumanityProxy
    */
    constructor(address _proofOfHumanity) {
        if (_proofOfHumanity == address(0)) revert Errors.InitParamsInvalid();
        proofOfHumanity = _proofOfHumanity;
        governor = msg.sender;
    }

    /* External and public */

    /** @dev Allows a sideRegistry to be part of the RegistryProxy
     * @param _newSideRegistry An IProofOfHumanity contract implementation as a side registry
     */
    function addSideRegistry(address _newSideRegistry) external onlyGovernor {
        addressToSideRegistry[_newSideRegistry] = IProofOfHumanity(_newSideRegistry);
        emit SideRegistryAdded(_newSideRegistry);
    }

    /** @dev It route the submission to the side registry. If the addSubmission fails in the side registry, it will be reverted
     * If it succeeds, no matter if it's an asyncronous process, RegistryProxy will take this call as if the submitter is fully registered.
     * @param _sideRegistry The side registry in which the submitter wish to register.
     * @param _evidence To be forwarded to the side registry
     * @param _name To be forwared to the side registry
     */
    function addSideRegistrySubmission(address _sideRegistry, string calldata _evidence, string calldata _name) external payable {
        IProofOfHumanity sideRegistry = addressToSideRegistry[_sideRegistry];
        sideRegistry.addSubmission(_evidence, _name);
        submissionToSideRegistry[msg.sender] = true;
        emit SideRegistrySubmissionAdded(_sideRegistry, msg.sender);
    }

    /** @dev
     * @param _newProofOfHumanity Change for another implementation of ProofOfHumanity. It should follow the IProofOfHumanity interface.
     */
    function changeProofOfHumanity(address _newProofOfHumanity) external onlyGovernor {
        proofOfHumanity = _newProofOfHumanity;
        emit ProofOfHumanityChanged(_newProofOfHumanity);
    }

    /** @dev
     * @param _newGovernor Change for another governance address.
     */
    function changeGovernor(address _newGovernor) external onlyGovernor {
        governor = _newGovernor;
        emit GovernorChanged(_newGovernor);
    }

    /** @dev 
     * To be "registered" means that you are registered in the PoH base registry AND you aren't registered in any side registry 
     */
    function isRegistered(address _submissionID) external view returns (bool){
        return !submissionToSideRegistry[_submissionID] && IProofOfHumanity(proofOfHumanity).isRegistered(_submissionID);
    }

}
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
    address public governor; // The address that can invoke some governance changes in RegistryLevel.
    IProofOfHumanity[] public sideRegistries; // The list of PoH side registries.
    mapping(uint => IProofOfHumanity) public idToSideRegistry; // The mapping that facilitates access to sideRegistries.
    
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
     * 
     */
    function addSideRegistry(address _newSideRegistry) external onlyGovernor {
        uint newSideRegistryId = sideRegistries.length + 1;
        IProofOfHumanity sideRegistry = IProofOfHumanity(_newSideRegistry);
        idToSideRegistry[newSideRegistryId] = sideRegistry;
        sideRegistries.push(sideRegistry);
        emit SideRegistryAdded(_newSideRegistry);
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
     * To be "registered" means that you are not registered in any side registry and you 
     * @inheritdoc IProofOfHumanity
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

}
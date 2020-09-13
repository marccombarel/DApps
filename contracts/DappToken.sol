pragma solidity ^0.5.0;

contract DappToken {
	// we need a constructor
	// we need to be able to set the number of tokens 
	// we need to read the number of tokens

	uint256 public totalSupply;

	constructor() public {
		totalSupply = 100000;
	}
}
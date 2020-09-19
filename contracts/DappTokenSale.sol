pragma solidity ^0.5.0;


import "./DappToken.sol";


contract DappTokenSale {
	address admin; 
	DappToken public tokenContract; 	// contract datatype
	uint256 public tokenPrice;
	uint256 public tokenSold;

	event Sell(address _buyer, uint256 _amount);	

  constructor(DappToken _tokenContract, uint256 _tokenPrice) public {
  	admin         = msg.sender; 		// assign an admin
  	tokenPrice 	  = _tokenPrice;		// set a token price in wei
  	tokenContract = _tokenContract;		
  }

  // multiply function to make safe calculation
  // pure -> it's not written in the blockchain
  function multiply(uint x, uint y) internal pure returns(uint z){
  	require (y==0 || (z= x*y)/y ==x);
  }
  

  function buyTokens (uint256 _numberOfTokens) public payable {
  	require (msg.value == multiply(_numberOfTokens, tokenPrice));            // require value is equal tokens (price)
  	require (tokenContract.balanceOf(address(this)) >= _numberOfTokens);	   // require contract has enough token
  	require (tokenContract.transfer(msg.sender, _numberOfTokens));           // require transfer is successful

  	tokenSold += _numberOfTokens;        		// Keep track of token sold
  	emit Sell(msg.sender, _numberOfTokens); // triger sell event  	
  }

  function endSale() public{
  	require (msg.sender == admin);			// require admin to end sale
  	require (tokenContract.transfer(admin, tokenContract.balanceOf(address(this)))); // send back remaining token to admin
  	selfdestruct(msg.sender);   				// destroy contract when ending sale
  }
  


}


pragma solidity ^0.5.0;
// https://www.youtube.com/watch?time_continue=4&v=XdKv5uwEk5A&feature=emb_logo&ab_channel=DappUniversity

contract DappToken {
	// We set the global variables needed for our smart contract:
	// • name of the token and symbol of the crypto
	// • the supply amount of tokens
	// • address and amount of tokens
	string  public name   = 'Dapp Token';     // token name on the app
	string  public symbol = 'DAPP';           // token name = currency name
	// string  public standard = 'DAPP v1';   // token name = currency name
	uint256 public totalSupply;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	mapping(address => uint256) public balanceOf;
	
	// we need to be able to set the number of tokens per account
	// we need to read the number of tokens





	// Initializer function:
	constructor() public {
		// • we set the initial supply of availoable token for our app
		// • we allocate all the tokens to the admin (the one that called the function)
		totalSupply = 100000;
		balanceOf[msg.sender] = 100000;
	}



	// Transfer function
	function transfer(address _to, uint256 _value) public returns(bool success){
		// exception if not enough tokens
		require(balanceOf[msg.sender] >= _value); // require --> if true, continue, if not stop	
		// Now we need to transfer the balance
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;

		Transfer(msg.sender, _to, _value);
		return true;                              // need to return a boolean to be ERC20

	}
}
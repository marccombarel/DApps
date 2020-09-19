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
	event Approval(address indexed _owner, address indexed _spender, uint256 _value);

	mapping(address => uint256) public balanceOf;
	mapping(address => mapping (address => uint256)) public allowance; // account A, approves Account B with the Vakue X


	// I.  Initializer function:
	constructor(uint256 _totalSupply) public {
		// • we set the initial supply of availoable token for our app
		// • we allocate all the tokens to the admin (the one that called the function)
		totalSupply = _totalSupply;
		balanceOf[msg.sender] = 1000000;
	}


	// II.  Transfer function
	function transfer(address _to, uint256 _value) public returns(bool success){
		// exception if not enough tokens
		require(balanceOf[msg.sender] >= _value); // require --> if true, continue, if not stop	
		// Now we need to transfer the balance
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;

		emit Transfer(msg.sender, _to, _value);		  // need a transfer event to be ERC20
		return true;                              // need to return a boolean to be ERC20
	}


	//III.  Delegated Transfer function
	// 2 steps process:
	// • allow us to do the transfer (with approve function)
	// • do the transfer, allowance (with transferfrom function)
	function approve (address _spender, uint256 _value) public returns(bool success){
		allowance[msg.sender][_spender] = _value;
		emit Approval(msg.sender, _spender, _value);
		return true;
	}
	
	function transferfrom (address _from, address _to, uint256 _value) public returns(bool success){
		require (_value  <= balanceOf[_from] );              // enough token to do the transfer
		require (_value  <= allowance[_from][msg.sender]);   // require that amount of msg.sender is big enough to do a transfer on behalf of _from account
		balanceOf[_from] -= _value;							 // updating the balance of accounts
		balanceOf[_to]   += _value;

		allowance[_from][msg.sender] -= _value;              // keep track of the allowances
		
		emit Transfer(_from, _to, _value);
		return true;
	}
}
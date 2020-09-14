var DappToken = artifacts.require("./DappToken.sol");


// Test function:

contract("DappToken", function(accounts){ // we select the contratc and all the accounts registered (from ganache)
	var tokenInstance;

	it("initializes the contract with the correct values", function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.name();
		}).then(function(name){
			assert.equal(name, 'Dapp Token', 'has the correct name');
			return tokenInstance.symbol();
		}).then(function(symbol){
			assert.equal(symbol, 'DAPP' , "has the correct symbol");
		});
	})


	it("set's the total supply upon deployement", function(){	
		// we read just like we did in the console
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply){
			// we test that the total supply is what we specified
			assert.equal(totalSupply.toNumber(), 1000000, "set's the total supply to 100,000");
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance){
			assert.equal(adminBalance.toNumber(), 1000000, "allocating the initial supply to admin");
		});
	});


	it("transfer token ownership", function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			// test `require`statement by transferring a larger amount than the account balance
			return tokenInstance.transfer.call(accounts[1], 999999999999999);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
			return tokenInstance.transfer(accounts[1],250000, { from: accounts[0]});
		}).then(function(receipt){
			return tokenInstance.balanceOf(accounts[1]);
		}).then(function(balance){
			assert.equal(balance.toNumber(), 250000, "adds the amount to the receiving accounts")
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(balance){
			assert.equal(balance.toNumber(), 750000, "deducts the amount")
		});
	});


	it('approves tokens for delegated transfer', function() {
	  return DappToken.deployed().then(function(instance) {
	    tokenInstance = instance;
	    return tokenInstance.approve.call(accounts[1], 100);
	  }).then(function(success) {
	    assert.equal(success, true, 'it returns true');
	    return tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
	  }).then(function(receipt) {
	    assert.equal(receipt.logs.length, 1, 'triggers one event');
	    assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
	    assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
	    assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
	    assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
	    return tokenInstance.allowance(accounts[0], accounts[1]);
	  }).then(function(allowance) {
	    assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated trasnfer');
	  });
	});
});

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
			assert.equal(totalSupply.toNumber(), 100000, "set's the total supply to 100,000");
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance){
			assert.equal(adminBalance.toNumber(), 100000, "allocating the initial supply to admin");
		});
	});



	it("transfer token ownership", function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			// test `require`statement by transferring a larger amount than the account balance
			return tokenInstance.transfer.call(accounts[1], 999999999999999);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
			return tokenInstance.transfer(accounts[1],25000, { from: accounts[0]});
		}).then(function(receipt){
			return tokenInstance.balanceOf(accounts[1]);
		}).then(function(balance){
			assert.equal(balance.toNumber(), 25000, "adds the amount to the receiving accounts")
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(balance){
			assert.equal(balance.toNumber(), 75000, "deducts the amount")
		});
	})





});

var DappToken = artifacts.require("./DappToken.sol");


// Test function:

contract("DappToken", function(accounts){
	it("set's the total supply upon deployement", function(){
		
		// we read just like we did in the console
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply){

			// we test that the total supply is what we specified
			assert.equal(totalSupply.toNumber(), 100000, "set's the total supply to 100,000");
		});
	});
});

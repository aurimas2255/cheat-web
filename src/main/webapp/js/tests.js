QUnit.test("Round: getPlayableRanks() - previously played rank is between Ace and King", function( assert ) {
	var round = Round();
	round.addClaim(new Claim(new Player(), 6, []));
	
	var ranks = round.getPlayableRanks();
	
	assert.ok(ranks.indexOf(5) != -1, "Passed!" );
	assert.ok(ranks.indexOf(6)  != -1, "Passed!" );
	assert.ok(ranks.indexOf(7)  != -1, "Passed!" );
});

QUnit.test("Round: getPlayableRanks() - previously played rank is Ace", function( assert ) {
	var round = Round();
	round.addClaim(new Claim(new Player(), 1, []));
	
	var ranks = round.getPlayableRanks();
	
	assert.ok(ranks.indexOf(13) != -1, "Passed!" );
	assert.ok(ranks.indexOf(1)  != -1, "Passed!" );
	assert.ok(ranks.indexOf(2)  != -1, "Passed!" );
});

QUnit.test("Round: getPlayableRanks() - previously played rank is King", function( assert ) {
	var round = Round();
	round.addClaim(new Claim(new Player(), 13, []));
	
	var ranks = round.getPlayableRanks();
	
	assert.ok(ranks.indexOf(12) != -1, "Passed!" );
	assert.ok(ranks.indexOf(13)  != -1, "Passed!" );
	assert.ok(ranks.indexOf(1)  != -1, "Passed!" );
});

var Player = function(name) {
	this.name = name;
	this.hand = [];
	
	this.getHand = function() {
		return this.hand;
	}
	
	this.addCard = function(card) {
		this.hand.push(card);
	}
	
	this.arrangeHand = function() {
		this.hand.sort(function(a, b) {
			var result = a.value - b.value;
			if (result == 0) {
				result = a.suit.value - b.suit.value;
			}
			return result;
		})
	}
	
	/*
	this.getCardsByIndexes = function(indexes) {
		var cards = [];
		for (var i = 0; i < indexes.length; i++) {
			cards.push(this.hand[indexes[i]]);
		}
		return cards;
	};
	*/
	
	this.removeCardsByIndexes = function(indexes) {
		var removedCards = [];
		var newHand = [];
		for (var i = 0; i < this.hand.length; i++) {
			if (indexes.indexOf(i) == -1) {
				newHand.push(this.hand[i]);
			} else {
				removedCards.push(this.hand[i]);
			}
		}
		this.hand = newHand;
		return removedCards;
	}
}


var AIPlayer = function(name) {
	var instance = new Player(name);
	
	var intersect = function (a, b) {
	  var ai=0, bi=0;
	  var result = new Array();

	  while( ai < a.length && bi < b.length )
	  {
	     if      (a[ai] < b[bi] ){ ai++; }
	     else if (a[ai] > b[bi] ){ bi++; }
	     else /* they're equal */
	     {
	       result.push(a[ai]);
	       ai++;
	       bi++;
	     }
	  }

	  return result;
	}
	
	var getAvailableRanks = function() {
		var ranks = [];
		var hand = instance.getHand();
		for (var i = 0; i < hand.length; i++) {
			if (ranks.indexOf(hand[i].value) == -1) {
				ranks.push(hand[i].value);
			}
		}
		return ranks;
	}
	
	var getPlayableRanks = function(round) {
		return intersect(round.getPlayableRanks(), getAvailableRanks());
	}
	
	var takeCardsWithRank = function(rank) {
		var indexes = [];
		var hand = instance.getHand();
		for (var i = 0; i < hand.length; i++) {
			if (hand[i].value == rank) {
				indexes.push(i);
			}
		}
		return instance.removeCardsByIndexes(indexes);
	}
	
	instance.makeClaim = function(round) {
		var playableRanks = getPlayableRanks(round);
		var rankToPlay = playableRanks[Math.floor(Math.random() * playableRanks.length)];
		
		return new Claim(instance, rankToPlay, takeCardsWithRank(rankToPlay));
	}
	
	return instance;
}


function Claim(player, rank, cards) {
	this.player = player;
	this.rank = rank;
	this.cards = cards;

	var getRankDescription = function() {
		var description;
		
		switch (rank) {
		case 1:
			description = "ace";
			break;
		case 2:
			description = "two";
			break;
		case 3:
			description = "three";
			break;
		case 4:
			description = "four";
			break;
		case 5:
			description = "five";
			break;
		case 6:
			description = "six";
			break;
		case 7:
			description = "seven";
			break;
		case 8:
			description = "eight";
			break;
		case 9:
			description = "nine";
			break;
		case 10:
			description = "ten";
			break;
		case 11:
			description = "jack";
			break;
		case 12:
			description = "queen";
			break;
		case 13:
			description = "king";
			break;
		}
		
		if (cards.length > 1) {
			if (rank == 6) {
				description += "es";
			} else {
				description += "s";
			}
		}
		
		return description;
	}
	
	this.getDescription = function() {
		return player.name + " played " + cards.length + " " + getRankDescription();
	}
}

var Round = function() {
	var instance = {};
	var claims = [];
	
	instance.addClaim = function(claim) {
		claims.push(claim);
	}
	
	instance.getPlayableRanks = function() {
		var previousRank = claims[claims.length - 1].rank;
		if (previousRank == 1) {
			return [13, 1, 2];
		} else if (previousRank == 13) {
			return [12, 13, 1];
		} else {
			return [previousRank - 1, previousRank, Number(previousRank) + 1];
		}
	}
	
	return instance;
}


var TurnPhase = {
		DECLARE: 'DECLARE',
		CHALLENGE: 'CHALLENGE',
		RESULT: 'RESULT'
};

function Cheat() {
	this.players = [
            new Player("Human"), 
            AIPlayer("Branston the Eyrie"), 
            AIPlayer("Timmy the Tuskaninny"), 
            AIPlayer("Chuffer Bob the Meerka")];
	this.pile = [];
	this.turnDescription;
	this.turnPlayer;
	this.turnPhase;
	this.turnPlayerSequence = [this.players[0], this.players[1], this.players[2], this.players[3]];
	this.currentClaim;
	this.currentRound;
	
	var that = this;
	
	this.dealPlayerHands = function() {
		var deck = new Deck();
		while (deck.isNotEmpty()) {
			for (var i = 0; i < this.players.length; i++) {
				this.players[i].addCard(deck.deal());
			}
		}
	}
	
	this.getHumanPlayer = function() {
		return this.players[0];
	}
	
	this.getAIPlayer1 = function() {
		return this.players[1];
	}
	
	this.getAIPlayer2 = function() {
		return this.players[2];
	}
	
	this.getAIPlayer3 = function() {
		return this.players[3];
	}
	
	this.start = function() {
		this.dealPlayerHands();
		this.getHumanPlayer().arrangeHand();
		
		this.currentRound = Round();
		
		this.turnDescription = "You can play cards of any value this turn!";
		this.turnPlayer = this.turnPlayerSequence[0];
		this.turnPhase = TurnPhase.CLAIM;
	}
	
	this.takeHumanPlayerTurn = function(declaredValue, selectedCardIndexes) {
		var selectedCards = this.turnPlayer.removeCardsByIndexes(selectedCardIndexes);
		this.pile = this.pile.concat(selectedCards);
		this.currentClaim = new Claim(this.turnPlayer, declaredValue, selectedCards);
		
		this.turnDescription = "No one accused you of cheating.";
		this.turnPhase = TurnPhase.RESULT;
	}
	
	this.isClaimPhase = function() {
		return this.turnPhase == TurnPhase.CLAIM;
	}
	
	this.isResultPhase = function() {
		return this.turnPhase == TurnPhase.RESULT;
	}
	
	this.isChallengePhase = function() {
		return this.turnPhase == TurnPhase.CHALLENGE;
	}
	
	this.isHumanPlayerTurn = function() {
		return this.turnPlayer === this.getHumanPlayer();
	}

	var startAIPlayerTurn = function() {
		var claim = that.turnPlayer.makeClaim(that.currentRound);
		that.currentClaim = claim;
		that.pile = that.pile.concat(claim.cards);
		
		that.turnDescription = claim.getDescription();
		that.turnPhase = TurnPhase.CHALLENGE;
	}
	
	var startHumanPlayerTurn = function() {
		that.turnDescription = "You can play cards of any value this turn!";
		that.turnPhase = TurnPhase.CLAIM;
	}
	
	this.startNextPlayerTurn = function() {
		this.currentRound.addClaim(this.currentClaim);
		this.currentClaim = null;
		
		this.turnPlayerSequence.push(this.turnPlayerSequence.shift());
		this.turnPlayer = this.turnPlayerSequence[0];
		
		if (this.turnPlayer != this.getHumanPlayer()) {
			startAIPlayerTurn();
		} else {
			startHumanPlayerTurn();
		}
	}
	
}

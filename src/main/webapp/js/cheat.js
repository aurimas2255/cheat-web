function Player() {
	this.hand = [];
	
	this.addCard = function(card) {
		this.hand.push(card);
	}
}

function Cheat() {
	this.players = [new Player(), new Player(), new Player(), new Player()];
	this.pile = [];
	
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
	}
}

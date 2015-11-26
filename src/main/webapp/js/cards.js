function Card(value, suit) {
	this.value = value;
	this.suit = suit;
	
	this.getImageName = function() {
		return this.value + "_" + this.suit.description;
	}
	
	this.equals = function(card) {
		return this.value == card.value && this.suit === card.suit;
	}
}

var Suit = {
	CLUB: {
		description: 'clubs',
		value: 0
	},
	SPADE: {
		description: 'spades',
		value: 1
	},
	HEART: {
		description: 'hearts',
		value: 2
	},
	DIAMOND: {
		description: 'diamonds',
		value: 3
	}
};

function Deck() {
	var shuffle = function(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}
	
	this.cards = function() {
		var values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
		var suits = [Suit.CLUB, Suit.SPADE, Suit.HEART, Suit.DIAMOND];
		var cards = [];
		for (var i = 0; i < values.length; i++) {
			for (var j = 0; j < suits.length; j++) {
				cards.push(new Card(values[i], suits[j]));
			}
		}
		return shuffle(cards);
	}();
	
	this.deal = function() {
		return (this.cards.length > 0) ? this.cards.shift() : null;
	}
	
	this.isNotEmpty = function() {
		return this.cards.length > 0;
	}
}

class Deck {
    constructor() {
      this.deck = [];
      this.populateCards();
      this.shuffle();
    }

    clearDeck() {
        this.deck = [];
        this.burn = [];
    }

    populateCards() {
        const suits = ["D", "H", "C", "S"]
        const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
        
        this.clearDeck();

        // create all cards
        suits.forEach(s => {
            ranks.forEach(r => {
                const c = new Card(r, s)
                this.deck.push(c)
            })
        })
    }

    // fisher yates shuffle
    shuffle() {
        for (let i = this.deck.length - 1; i >= 0; i--) {
            const newPosition = Math.floor((i + 1) * Math.random());
            const temp = this.deck[newPosition];
            this.deck[newPosition] = this.deck[i];
            this.deck[i] = temp;
        }
    }

    deal() {
        const dealt = this.deck.pop()
        this.burn.push(dealt);
        return dealt;
    }
}  

class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }

    toString() {
        let renderedSuit = null; 
        
        if (this.suit == 'D') {
            renderedSuit = '♦'
        } else if (this.suit == 'H') {
            renderedSuit = '♥'
        } else if (this.suit == 'S') {
            renderedSuit = '♠'
        } else if (this.suit == 'C') {
            renderedSuit = '♣'
        }
        return `${this.rank}${renderedSuit}`
    }

    value() {
        switch (this.rank) {
            case 'A':
                return 1
            case '2':
                return 2
            case '3':
                return 3
            case '4':
                return 4    
            case '5':
                return 5
            case '6':
                return 6
            case '7':
                return 7
            case '8':
                return 8
            case '9':
                return 9
            case '10':
                return 10
            case 'J':
                return 10
            case 'Q':
                return 10
            case 'K':
                return 10
        }
    }
}

class Hand {
    constructor(c) {
        this.cards = [c];
        this.scores = [];
        this.updateScore();
    }

    // settles ace hand ambiguity
    bestScore() {
        return Math.max(...this.scores)
    }

    // returns hand score(s), 2 in the case of ace hand 
    updateScore() {
        const baseHandSum = this.cards.map((card) => card.value()).reduce((partialSum, a) => partialSum + a, 0)

        this.scores = [baseHandSum];

        if (this.hasAce() && baseHandSum <= 11) {
            this.scores.push(baseHandSum + 10);
        }
        console.log(this.scores)
    }

    hasAce() {
        return this.cards.some(card => card.rank == 'A')
    }

    addCard(c) {
        this.cards.push(c);
        this.updateScore();
    }

    isBust() {
        return this.bestScore() > 21;
    }

    isBlackJack() {
        console.log(this.bestScore())
        return this.bestScore() === 21;
    }

    getScores() {
        return this.scores;
    }

    getScore(i) {
        return this.scores[i];
    }
}

module.exports = { Deck, Hand }
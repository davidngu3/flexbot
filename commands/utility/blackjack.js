const { SlashCommandBuilder } = require('discord.js');
const { Deck, Hand } = require('./deckutils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bj')
        .setDescription('Play blackjack'),
    async execute(interaction) {
        // Create new deck
        const deck = new Deck();

        // Deal first and second card for player
        const playerCardOne = deck.deal();
        const playerCardTwo = deck.deal();
        const playerHand = new Hand(playerCardOne);
        playerHand.addCard(playerCardTwo);

        // detect early blackjack
        if (playerHand.isBlackJack()) {
            interaction.reply(`Your cards are: ${playerCardOne} and ${playerCardTwo}. You got blackjack! Game over..`);
            return;
        }

        // Deal first card for dealer
        const dealerCardOne = deck.deal();
        const dealerHand = new Hand(dealerCardOne);

        // Set up collector to collect messages from the user for 30 seconds
        const collectorFilter = message => message.author.id === interaction.user.id

        const collector = interaction.channel.createMessageCollector({ filter: collectorFilter, time: 60_000 });

        // Start game
        await interaction.reply(`Let's play blackjack! Your cards are: ${playerCardOne} and ${playerCardTwo}. The dealer has ${dealerCardOne}. Type 'hit' or 'stay' to play`);

        collector.on('collect', m => {
            console.log(`collect event fired, with ${m.content}`)
            if (m.content.includes('hit')) {
                console.log("hit event fired")
                const dealtCard = deck.deal();

                playerHand.addCard(dealtCard);
                interaction.channel.send(`You drew a ${dealtCard}`);

                if (playerHand.isBust()) {
                    interaction.channel.send(`You lose! You hit ${playerHand.bestScore()}`)
                    collector.stop()
                }
                else if (playerHand.isBlackJack()) {
                    interaction.channel.send(`You win! You hit blackjack!`)
                    collector.stop()
                }
                else {
                    if (playerHand.getScores().length > 1) {
                        interaction.channel.send(`Your hand total is ${playerHand.getScore(0)} or ${playerHand.getScore(1)}. hit or stay?`);
                    }
                    else {
                        interaction.channel.send(`Your hand total is ${playerHand.bestScore()}. hit or stay?`);
                    }
                }

            } else if (m.content.includes('stay')) {
                console.log("stay event fired")
                // play rest of dealer hand and calc winner
                while (dealerHand.bestScore() < 17) {
                    const dealtCard = deck.deal();
                    dealerHand.addCard(dealtCard);
                    interaction.channel.send(`Dealer drew a ${dealtCard}`);
                }
                if (dealerHand.isBust()) {
                    interaction.channel.send(`You win! Dealer went bust with ${dealerHand.bestScore()}`)
                }
                else if (dealerHand.isBlackJack()) {
                    interaction.channel.send(`You lose! Dealer hit blackjack!`)
                }
                else {
                    if (dealerHand.bestScore() > playerHand.bestScore()) {
                        interaction.channel.send(`You lose! Dealer hit ${dealerHand.bestScore()} and you hit ${playerHand.bestScore()}`)
                    }
                    else {
                        interaction.channel.send(`You win! Dealer hit ${dealerHand.bestScore()} and you hit ${playerHand.bestScore()}`)
                    }
                }
                collector.stop()
            } else {
                interaction.channel.send(`Invalid blackjack action. Please reply 'hit' or 'stay'`);
            }
        });

        collector.on('end', () => {
            console.log(`game over event`);
            interaction.channel.send(`Game over!`);
        });
    },
};
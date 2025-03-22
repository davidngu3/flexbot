const { SlashCommandBuilder } = require('discord.js');
const { runTheSimulation } = require('../roulette-runner');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamble')
        .setDescription('Run a roulette simulation with specified parameters')
        .addNumberOption(option =>
            option.setName('startingbet')
                .setDescription('The initial bet amount')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('ratio')
                .setDescription('The multiplier for each subsequent bet')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('days')
                .setDescription('Number of days to simulate')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('budget')
                .setDescription('Starting budget for the simulation')
                .setRequired(true)),
    async execute(interaction) {
        // Defer the reply since the simulation might take some time
        await interaction.deferReply();

        const startingBet = interaction.options.getNumber('startingbet');
        const ratio = interaction.options.getNumber('ratio');
        const numberOfDays = interaction.options.getInteger('days');
        const budget = interaction.options.getNumber('budget');

        try {
            const result = runTheSimulation(startingBet, ratio, numberOfDays, budget);
            
            // Format the response message
            const responseMessage = `
                🎲 **Roulette Simulation Results** 🎲

                **Input Parameters:**
                • Starting Bet: $${result.inputParameters.startingBet}
                • Ratio: ${result.inputParameters.ratio}
                • Days: ${result.inputParameters.numberOfDays}
                • Budget: $${result.inputParameters.budget}

                **Statistics:**
                • Total Earnings: $${result.stats.totalEarnings.toFixed(2)}
                • Highest Point: $${result.stats.highestPoint.toFixed(2)}
                • Lowest Point: $${result.stats.lowestPoint.toFixed(2)}
                • Average Bets per Day: ${result.stats.avgNumOfBets.toFixed(2)}
                • Highest Number of Bets in a Day: ${result.stats.highestNumOfBets}
                `;

            await interaction.editReply(responseMessage);
        } catch (error) {
            console.error('Error running simulation:', error);
            await interaction.editReply('❌ An error occurred while running the simulation. Please check your parameters and try again.');
        }
    },
}; 
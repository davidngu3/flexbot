const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('flex')
		.setDescription('Start a flex lobby for tonight')
		.addStringOption(option =>
			option.setName('time')
				.setDescription('The suggested time to flex')),
	async execute(interaction) {
		// set up flex message
		const timeSuggestion = interaction.options.getString('time') ? ` at ${interaction.options.getString('time')}` : '';
		const flexResponse = `${interaction.user.username} wants to flex tonight${timeSuggestion} 😈! React if joining`
		const response = await interaction.reply({ content: flexResponse, withResponse: true });
		sentMessage = response.resource.message;
		await sentMessage.react('👍').then(() => sentMessage.react('👎'));

		// set up the collector to stop on 5 thumbs up reacts
		const collectionFilter = (reaction, user) => {
			return reaction.emoji.name === '👍' && !user.bot;
		}

		const collector = sentMessage.createReactionCollector({ filter: collectionFilter, maxUsers: 5, dispose: true });
		console.log(`Collector starting up...`);

		collector.on('collect', (reaction, user) => {
			console.log(`Collect event: new ${reaction.emoji.name} reaction from ${user.tag}`);
		});

		collector.on('end', async (collected, reason) => {
			console.log(`Collector shutting down, reason: ${reason}`);
			// reactions are no longer collected
			// if the 👍 emoji is clicked the MAX_REACTIONS times
			if (reason === 'userLimit') {
				const thumbsReaction = collected.find(messageReaction => messageReaction.emoji.name === '👍');
				const usersCollection = await thumbsReaction.users.fetch()
				const notBotUsers = usersCollection.filter((u) => !u.bot)
				const usersArray = [...notBotUsers.values()];
				console.log(`Flex limit reached: ${usersArray}`);
				interaction.channel.send(`LOCKED IN: Flexing with ${usersArray}${timeSuggestion}!`)
			}
		})
	},
};
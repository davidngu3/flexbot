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

		// collect reacts
		const collectionFilter = (reaction, user) => {
			console.log(reaction.emoji.name)
			console.log(user)
			return reaction.emoji.name === '👍' && !user.bot;
		}

		// set up the collector with the MAX_REACTIONS
		const collector = sentMessage.createReactionCollector({ filter: collectionFilter, max: 5 });

		collector.on('collect', (reaction, user) => {
			// in case you want to do something when someone reacts with 👍
			console.log(`Collected a new ${reaction.emoji.name} reaction from ${user.tag}`);
		});

		collector.on('end', async (collected, reason) => {
			// reactions are no longer collected
			// if the 👍 emoji is clicked the MAX_REACTIONS times
			if (reason === 'limit') {
				const thumbsReaction = collected.find(messageReaction => messageReaction.emoji.name === '👍');
				const usersCollection = await thumbsReaction.users.fetch()
				const notBotUsers = usersCollection.filter((u) => !u.bot)
				const usersArray = [...notBotUsers.values()];
				interaction.channel.send(`LOCKED IN: Flexing with ${usersArray}${timeSuggestion}!`)
			}
		})
	},
};
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { riot_token } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rito')
		.setDescription('Provides information about a league user')
        .addStringOption(option =>
			option
                .setName('riot-id')
				.setDescription('The full riot ID of the user, e.g. Noog#noog')
                .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
       
        try {
            // destructure summoner name
            const name = interaction.options.getString('riot-id')
            const [ summoner_name, summoner_tag ] = name.split('#')
            if (summoner_name == null | summoner_tag == null) {
                await interaction.editReply('Unable to parse Riot ID. Please enter full ID including the tag, e.g. summoner#OC');
                return;
            }

            // get puuid
            const accountResponse = await axios.get(`https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summoner_name}/${summoner_tag}?api_key=${riot_token}`);
            const puuid = accountResponse.data.puuid;
            
            // build ranked info
            const lolEntries = await axios.get(`https://oc1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}?api_key=${riot_token}`);
            let rankString = `${name} info:\n`;

            lolEntries.data.forEach(entry => {
                rankString += `${entry.queueType}: ${entry.tier} ${entry.rank} ${entry.leaguePoints}LP\n`;
            });
           
            await interaction.editReply(rankString);

        } catch(error) {
            console.log(error);
            await interaction.editReply('Unable to reach Riot API');
        }
	},
};
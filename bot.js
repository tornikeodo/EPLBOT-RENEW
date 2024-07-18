const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } = require('discord.js');
const noblox = require('noblox.js');
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages] 
});

const token = process.env.TOKEN;
const clientId = '1263159926520418365';
const guildId = '1245456364969398313';
const robloxCookie = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_898F68B3351C5DCA5B39AB47DB1A77F13855E251254E4053513D36CB259A18360C545107F1F55F89567A60C1556F266C2CC70FD41578BBD095669A5F7D0DA50B762371118E2D8B2B07DDE08266C6D450AF1AA8CF019FEC023B4EA54F7D499B76B4E7A3356AA45FADFDC66A45C5A2E6BB207AA6B04E5B3A91FA49F33AB95364C7882A2857870D6DD80841D61BA24205DE0D33CE0E0771574C46CBCDA50514E31A76EFEB5B15A4698D1722D0243DDD2DD6CAD5DF54BFD157DAE89082E4630EAC886AD11638E9B123D310BD378E26E8B0EF3655C649FDB2E5070528A691019051B815319A32AD0247A95032A6CCC593C5F92D66E0246877AA7D4C61656F8CF607E5129C65545E20D9A59EA2AE9AA470C8DCD2BACAC4AC41155B2304DEBE374A177EFEEC802E67714AC3C03FA8E1CBD8C827E6F26D0460C08A1E8BE2238BE9890F7FA5CF13900EB63187066DDAB39535B5D8AEE938DF8161561CE4ED44D56F7390D88513F7E72B976A941A33B905E9992539BBD497A39A6E70E966F7028055FB90325368E7B7FB40512984517D42A3E4C1EFC0B0EEDD27C13D41CBA839D20FA57D9AA81C9E14A5EDD30742C2B0EA4C314FE9D3B1EBB441487C256E6C06340DD13A6FCEB535BCF167AA1AF0AA164559AD998042796350A3CABD524E05D11252D8172400813089CD1FB9F978FE051BE9A1936047B27861D75B426746387C859A1DB3A94C56A26B487262DB9A579842B6AE16C0F8FCF25EAA19DB31EE1E0AE06D5696FE58468EE6EEBE8C96521F3D301E9AF2FE667928B5144C37608F4ADDD57228B09875E7F44E2DCEA91063C89BACCE6D5239A7D263E7576DAC8EA976DC8521A1BC1714B9157D15A042F83FE475A9A958C234CB86DDA82874EB87FC85899751A4DBF593891C92B9E3FF4327278977F3B82F7ECDFE7B2320CEF1F5995CC60FBF88129C5271CECA9020DF9B2CF32C7513CBDE30CA1CA9EAFDF1EEC15AC42D8EB7A325EB563DCF0FBD9A93BC5F08CFFEFA03055DD1631624E5EB46B2AF844953BCDF8FE954CCEC6A0225C555F3D6C51BEA1F5F73C2E9A8B04C460212914AA87B1DEE4F26A3CF5CAA';
const groupId = 9407655; // EPL group ID

const usedFriendlyCommand = new Set();

const statusMessages = ["Over EPL", "Over EPL"];
let currentIndex = 0;
const port = 3000;
const app = express();

// Express server setup
app.get('/', (req, res) => {
  res.send('YaY Your Bot Status Changed✨');
});

app.listen(port, () => {
  console.log(`🔗 Listening to RTX: http://localhost:${port}`);
  console.log(`🔗 Powered By RTX`);
});

// Noblox setup
async function startApp() {
  await noblox.setCookie(robloxCookie);
  console.log('Logged into Roblox!');
}

startApp();

// Discord bot setup
client.once('ready', () => {
  console.log('Ready!');
  client.user.setActivity('Over VRS', { type: ActivityType.Watching });
  updateStatusAndSendMessages();
  setInterval(updateStatusAndSendMessages, 10000);
});

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  new SlashCommandBuilder().setName('freeagent')
    .setDescription('Submit a free agent application.')
    .addStringOption(option => option.setName('username').setDescription('Your username').setRequired(true))
    .addStringOption(option => option.setName('position').setDescription('Position you are applying for').setRequired(true))
    .addStringOption(option => option.setName('about').setDescription('About you').setRequired(true)),
  new SlashCommandBuilder().setName('sign')
    .setDescription('Sign a user to a team.')
    .addUserOption(option => option.setName('user').setDescription('The user to sign').setRequired(true))
    .addStringOption(option => option.setName('teamname').setDescription('The team name').setRequired(true)),
  new SlashCommandBuilder().setName('request')
    .setDescription('Request to join the league.')
    .addStringOption(option => option.setName('username').setDescription('Your username').setRequired(true))
    .addStringOption(option => option.setName('past_experiences').setDescription('Your past experiences').setRequired(true))
    .addStringOption(option => option.setName('how_did_you_find_the_league').setDescription('How did you find the league').setRequired(true)),
  new SlashCommandBuilder().setName('friendly')
    .setDescription('Post a friendly request.')
    .addStringOption(option => option.setName('team_name').setDescription('The team name').setRequired(true))
    .addStringOption(option => option.setName('information').setDescription('Information about the request').setRequired(true)),
  new SlashCommandBuilder().setName('recommend')
    .setDescription('Recommend a user to join the group.')
    .addUserOption(option => option.setName('user').setDescription('The user to recommend').setRequired(true))
    .addStringOption(option => option.setName('robloxuser').setDescription('The Roblox username').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for recommendation').setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  } else if (commandName === 'freeagent') {
    const username = interaction.options.getString('username');
    const position = interaction.options.getString('position');
    const about = interaction.options.getString('about');

    const embed = {
      color: 0x0099ff,
      title: 'Free Agent Application',
      fields: [
        { name: 'Username', value: username },
        { name: 'Position', value: position },
        { name: 'About Me', value: about },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Free Agent Application',
      },
    };

    const channel = client.channels.cache.get('YOUR_CHANNEL_ID');
    if (channel) {
      await channel.send({ embeds: [embed] });
      await interaction.reply({ content: 'Application submitted!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Failed to find the specified channel.', ephemeral: true });
    }
  } else if (commandName === 'sign') {
    const user = interaction.options.getUser('user');
    const teamName = interaction.options.getString('teamname');

    const embed = {
      color: 0x00ff00,
      title: 'New Signing!',
      description: `${user} has been signed to ${teamName}!`,
      timestamp: new Date(),
      footer: {
        text: 'Team Signing',
      },
    };

    const channel = client.channels.cache.get('YOUR_CHANNEL_ID');
    if (channel) {
      await channel.send({ embeds: [embed] });
      await interaction.reply({ content: 'Sign message sent!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Failed to find the specified channel.', ephemeral: true });
    }
  } else if (commandName === 'request') {
    const username = interaction.options.getString('username');
    const pastExperiences = interaction.options.getString('past_experiences');
    const howDidYouFindTheLeague = interaction.options.getString('how_did_you_find_the_league');

    await interaction.deferReply({ ephemeral: true });

    const embed = {
      color: 0x0000ff,
      title: 'League Request',
      fields: [
        { name: 'Username', value: username },
        { name: 'Past Experiences', value: pastExperiences },
        { name: 'How did you find the league?', value: howDidYouFindTheLeague },
      ],
      timestamp: new Date(),
      footer: {
        text: 'League Request',
      },
    };

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('accept')
          .setLabel('✅')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('reject')
          .setLabel('❌')
          .setStyle(ButtonStyle.Danger)
      );

    const channel = client.channels.cache.get('1263122231450664980');
    if (channel) {
      const message = await channel.send({ embeds: [embed], components: [row] });
      await interaction.editReply({ content: 'Request sent!', ephemeral: true });

      const filter = i => i.customId === 'accept' || i.customId === 'reject';
      const collector = message.createMessageComponentCollector({ filter, time: 60000 });

      collector.on('collect', async i => {
        if (i.customId === 'accept') {
          try {
            const users = await noblox.getJoinRequests(groupId);
            const userRequest = users.data.find(user => user.requester.username === username);
            if (userRequest) {
              await noblox.handleJoinRequest(groupId, userRequest.requester.userId, true);
              await i.deferUpdate();
              await interaction.user.send('You have been accepted to the group!');
            } else {
              await i.update({ content: 'User not found in join requests.', ephemeral: true });
            }
          } catch (error) {
            console.error(error);
            await i.update({ content: 'An error occurred while accepting the request.', ephemeral: true });
          }
        } else if (i.customId === 'reject') {
          await i.deferUpdate();
          await interaction.user.send('You have been rejected from the group!');
        }
      });

      collector.on('end', collected => {
        console.log(`Collected ${collected.size} interactions.`);
      });
    } else {
      await interaction.editReply({ content: 'Failed to find the specified channel.', ephemeral: true });
    }
  } else if (commandName === 'friendly') {
    const teamName = interaction.options.getString('team_name');
    const information = interaction.options.getString('information');

    if (usedFriendlyCommand.has(interaction.user.id)) {
      await interaction.reply({ content: 'You can only use this command once every hour.', ephemeral: true });
      return;
    }

    const embed = {
      color: 0xff0000,
      title: 'Friendly Request',
      fields: [
        { name: 'Team Name', value: teamName },
        { name: 'Information', value: information },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Friendly Request',
      },
    };

    const channel = client.channels.cache.get('YOUR_CHANNEL_ID');
    if (channel) {
      await channel.send({ embeds: [embed] });
      await interaction.reply({ content: 'Friendly request sent!', ephemeral: true });
      usedFriendlyCommand.add(interaction.user.id);
      setTimeout(() => {
        usedFriendlyCommand.delete(interaction.user.id);
      }, 3600000); // 1 hour cooldown
    } else {
      await interaction.reply({ content: 'Failed to find the specified channel.', ephemeral: true });
    }
  } else if (commandName === 'recommend') {
    const user = interaction.options.getUser('user');
    const robloxuser = interaction.options.getString('robloxuser');
    const reason = interaction.options.getString('reason');

    const embed = {
      color: 0x00ff00,
      title: 'Recommendation',
      description: `**Recommended User:** ${user}\n**Roblox Username:** ${robloxuser}\n**Reason:** ${reason}`,
      timestamp: new Date(),
      footer: {
        text: 'Recommendation',
      },
    };

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('accept')
          .setLabel('✅')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('reject')
          .setLabel('❌')
          .setStyle(ButtonStyle.Danger)
      );

    const channel = client.channels.cache.get('SPECIFIC_CHANNEL_ID'); // Replace with actual channel ID
    if (channel) {
      const message = await channel.send({ embeds: [embed], components: [row] });
      await interaction.reply({ content: 'Recommendation sent!', ephemeral: true });

      const filter = i => i.customId === 'accept' || i.customId === 'reject';
      const collector = message.createMessageComponentCollector({ filter, time: 60000 });

      collector.on('collect', async i => {
        if (i.customId === 'accept') {
          try {
            const users = await noblox.getJoinRequests(groupId);
            const userRequest = users.data.find(user => user.requester.username === robloxuser);
            if (userRequest) {
              await noblox.handleJoinRequest(groupId, userRequest.requester.userId, true);
              await i.deferUpdate();
              await user.send(`You have been recommended to the server by ${interaction.user.username}!`);
              await i.update({ content: 'Recommendation accepted and group request approved.', ephemeral: true });
            } else {
              await i.update({ content: 'User not found in join requests.', ephemeral: true });
            }
          } catch (error) {
            console.error(error);
            await i.update({ content: 'An error occurred while accepting the recommendation.', ephemeral: true });
          }
        } else if (i.customId === 'reject') {
          await i.deferUpdate();
          await i.update({ content: 'Recommendation rejected.', ephemeral: true });
        }
      });

      collector.on('end', collected => {
        console.log(`Collected ${collected.size} interactions.`);
      });
    } else {
      await interaction.reply({ content: 'Failed to find the specified channel.', ephemeral: true });
    }
  }
});

client.login(token);

function updateStatusAndSendMessages() {
  const guild = client.guilds.cache.get(guildId);
  if (guild) {
    const memberCount = guild.memberCount;
    client.user.setActivity(`${memberCount} Players | Over EPL`, { type: ActivityType.Watching });

    if (currentIndex < statusMessages.length) {
      const statusMessage = statusMessages[currentIndex];
      const channel = client.channels.cache.get('YOUR_CHANNEL_ID');
      if (channel) {
        channel.send(statusMessage);
      }
      currentIndex++;
    } else {
      currentIndex = 0;
    }
  }
}

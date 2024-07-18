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
const robloxCookie = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_216FBAE0A216C29CBEA1202EBC50DD2CF7C432C2564151222BF17EDA8EA55B13DFF160433FC95212195F5B786AB8C13938723607CB958A2C9ABC3B461FCA5B7DBDDC751133AF0B4ED75C761F2DC4EB3EF4A31C8F73D735DE560B8B040CDAF46736A369C74225521AA4876C24951DC3D3B2E7AF69A8844A3E79BA8417FF8CEE39FFFD0F45442EA346ADA9318D45C1BD06E47ACC26A8572C27645D4B625C49A3E6D44146994EBED11C1327CC5EC04AA3150D1188EB495EBAF46353D0982C2C9DF02DB59F788BC86D521EA4BD6D4225FFEE1B278BD8422B0D07093706B581BE399EBF62DA5899F228E87BBDC07A0FF252E6771DFD4E02002A26C95853CA76B9D2052DE713CDE8862F999EA100016B9E67EF1D4828432C2886B7E18379B39C56196BCB6429755680397BE9990A0968178682F99D3BC73FBCC4EE43FDE5DE443625DAE76FC5F877E0ADA697AD7A0C4FC95F069577DCC60ECD0735597DD60114374B431CED554BCFDCDCDDF46CD148E77714EC0D1F259649EE48A2C8B54F8D8573D56E0EFAD243FFC83059D7661CE5E31B202B21B759D3B3BEEA9BF0ECD7F16757F752CBBBA4F61BA040D5A059E5C2FACCDEF85FE51603356E472D1982B805CA63FB531B62EA3E6D9DF878104A6D92BD4EDD5DDAAF68CA970BF793852AEF4C3B391582E4721F6C45B49E6D751BC5AC0B21E1E1D8FE58A7E499FCF992C5126AAD3615B21D6B2F66B3BA29770DFFB0B75F1336A17E6F3E93498E94EA0D15AEDA023595181D5DA0905332928644CC0F37AA629C04A3BA8EF5D3048DEEA1E8B498BD7064AE9A532ECB36DFAA5A59AF7E30708628DE1BEA40A8211017CC720B06AF32CF85C1A4EAB45FEC7CF4A4258A5A05F3ED6F4214BDBA25B096C011DBAF8025BD9E5DD65CCB53408A8E2D77C8A487D13DC643A18A62655ED8726FB1540FE32A6BC8EBB3F7A28E5605C1278D568E6AE7CD370256FA1DAE39CCB7C32998994105935B09A9DA89DF63DA0926581C83000EE40304FD0EF1EF5F84479CA568A6CB04CA3ED5C922AE001B229452374CB9E7AD474199D918CB1BCF7E9C479439DF217047329D816346B712';
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

    const channel = client.channels.cache.get('1263223403637243994'); // Replace with actual channel ID
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

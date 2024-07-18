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
const robloxCookie = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_EFB6B130F5923C07CDEC23113643F8027B43708D546F422E92E67C1B1A7B96C7B46193E8A0CB985CB7147174EE4D646A419B0C5D91D41EB6B19B8CD96522E8194D32AC2FDF508B1A1ED410E6FD5CED4E431D3C9CEF454F832B192BF9ABEECF1E909A4C77D978FC503E5A43BD26CFD0F20A6FED754C8C2870F95030E3763E687C5D459543E5167AE5B86312CA5B101ABED0399EDE117DB93AF17EC8F1D8B17C798CF2187940C560623AE96493C821514ED70771746E0E8309AEEEB2F760040CF528FB3E0D2A992AA996241E03BB15D838CFE3DB41DD49CC9B81DC39148247492AB538DA7560C594CEF969CE97513194425E95046A12D683220A4257C33763EB3A4EFFB0D194D0DBC7B29E768FB590C1A8DD7D1CA154A6E7F66229B15B9D9ACBC8DF16CE4592C7B84703B57973261471DAE485E9A9B98F7B383BEB2879A663DC3EE3E1E30E65FC9047F6603A10AF3DE2659435588226813F736ADA915CECECFFEA167C09A9E92011941C661AA1287398160C9078E1E2FCA407F2B49F258E2D98921F8795D6292EB07E354E08F1A9345E1002BBC7C5E144293DACCFE9E9B33A7D35783693D638548250FAA276A2E6F8F40BE95ED52B2FA6EE6A874AAF8848408E16C0AFC424DC4B9C153180F53A4DE6711E3E458DACB5C61C7AE583D89B9F860CA0C87C15628F8D2139D41D28FDAF3C38B26B1420661FDFAE1D3BB12A215D251FAFDC8E225B739E3D12FDBA8384DFC761B60E8498897B16C35F93F9D67A24148BE0144614D90EAEF9C38614146DF8AE8151621CE07A1AD8EE0933FBD271DE035C8745965831893AFD71F84DD61A8D0C487B850FE7FBD8DB8309CB6F0865F5F83B90D30BBF6C961892130150850E1F97C7F5BF73A5143C35F38A49A8ED8EACC201D2072F62A93E64AF45E6CEF56196BDD45B52197659B099CF6CC42B591CCCB484F61B8E7BDF976BAAEC1D68C2440B2DC692DE5EC0AFE5775CAC7557487B9942A017D1EA0DA61CEE3FA66D53C4250C8039C1D0C140C58820AE7F388FBAC511CBAB87BA7C1476CA895D680220C2DBC95F72C654F246479BFF36640D986F168CC4FE73F2278659';
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

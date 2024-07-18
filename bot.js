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
const robloxCookie = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_A7EA065F5F019304E990A23D6EFF11562464E52059F5B0767141D514BD3192359F6F15CA5CDF4A74CE50854B06633C960359C4EA10D430CABC41C2A2B8A27473E51DDA7F5C53079C1B68728C49A1EC1C6F84B2F47654B9D7440961104B3B571219AC1A9D7873A59F04A129AF72B8C5BFA6B82686951A55981F854BC1AFB412F2587435DB9A7B00CCB9971B63B7FCBCEB40011B0565246979976CE8639B150AE91D10FA62562D7966E31057D5372C7B0371BD0F4C0E97A466AB6C87AC6716D37435949701BB30313BB5E2860FF835A64B51D1B8C1410B6202C851B2EC5AD303A960262F2C75BD7F04D6055A26D7DCA6AE07A22A2831445B13FB076C1EECA5C50AF7BEE713998D021B02961DCF23C755A81F921DA7BA53A35AB5EC7E82ADB696F582C53A381814AD5B19D0771D90645FB4717BFB22E0A057FB5E567A91E0C224824B8FEFA59AB3F48DAEB5C058C2FAE26F3C8735C8F6030334C296F0C8821BF32384BDD9AE488771FB4ADAADD62BF7D35BFF7CDB40CAA505BC35D8BC0326B63F6628401A23AFB30CB22025CF624F4AF1419999698F899EDDFD183EB34860474C91B22701EB902717DEAB6A438190ECBCEFBA16E2CD2D05EC1E711B7E46ED7618E8E43318B2C12B0093F60E5A8EE3AA209510AEABA2B3C8B6C7EDE92F3642A3E6F0088709964360A69CC9F784598AB25D546F31F7ACD66E6244FF86754B4483CF8BF935D7993BE66E983C0FE08CA3DE74E6084C4947E85F5297E5D9262FDC5827C60DBF605DE3FBB133EBD9D0A76C4D5D2A136A358DDC4412EAE1DD1D54C2633778DE5F7AF8D219C828D4726CD74F7D717447A75614924921CA38AD8DB13B53E44D5EE71D0FCACA82C37BC7818E7A36F314B29A6B74887C149A3E22B67720BD7876AB3D290C8535CE4F7D60687526FE67186E935E6916289F2B8ACA6A77F5FD386D812767D578529CDAE14AC390C6EC28FC2CF202C761FBF0EE3FC2DBFBB24AC7C3D67534303CEA2F2A1C8DF389F1D36645A441C137918B47B88FE22C13E9294C6401E5FFED058B122DD33D36868FB798AB01833648D2DDD8D2BE54D3316480CAC6B96CFA00';
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

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
const robloxCookie = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_BB657603E793A1D40BD6C7F253D9457397582560DF3B44B0CEC1FC7E9C74D3EB249B0750D53118124B7876B2ACAB30B4D54DD87F75BF9D83F9074A375036598A36150FE60547384AFF9CA8F364FD937B3164D45AF958BBCF624B7347C2F38884A418FDE35CD1CFDE0203BB26B28FE3530B9BB60DE9EE333BAFABD5BA257A046963770E74C6C67024837019FF127F6A079DB0B09EC1963211049CE44DA6E4D34B1437781D7650520E98C73278F4F31BD54D3993CD1E97F5847A9BDBCAA73A3E7320510C40A1E14710FA5D37C39CACD6D4691804CC0F67C2C10E5B4A1FA2C4404609868980AA5D07CCCE5023E18F4E5973D3C931F274C6C3825F4EEE1617EFDA785280127CA67BBFB57C07D8A3AB2FB9CD14A93CB84CB2034F9CE506D257BD4C6E525F2645D079BA5A4F2B3CA81457BB34A410DF85ECC2D53C9F14D7D0217CDCCBBDCDE95B51DDB76F172FC329E1C2825ACDF3391255CD5D554D4D174E535364ACA17112EA3311C5C7565BD48A03722EEB1E93DC10162DF1337C45EE282EFC90A2CAE6D825255481BE0CCBE685EEC7E5A3CAE5E147356DF829834B78614C370338051ABA777FFCF6D02EA3F10808F91AFC45872429526E599ECCB9F1A61EDC7AB549ADBDE82A386716CB30355627F18D93F867D4C293A035676245620E79AAD96ADF111CD41D1F549DB5137702734A1A62EA90170EF6711A701FE66336D1457E0EE38E79F12D830379E0853BFC7361CF1C954553469678392BF9063F079606E8A4E0E61E7969B0C9BAF8DEE95104A02FA7D98C4F2D28A5FB697AE4AF753FD14350BE5C0B596415DDBC39D5F70929A178261752DAAA9C60BAC151A4739AAC24E0BB5370C309DFA8CC1E20F6BBBBCA68479C557D3DD709B997DD3CC1DAFFF101F0D1D5A321BE8BEDDFED987021743DDCF45214DF82B6D195857D841560865C59D8611CFFDE16F23A9360042829E73C306E21534575B36186DC3CD7B1A6B6D1AE3B12CBB699A24332805A0E0E0F99B54A7E68AC73636D83928371A0313118061F4BFEBE41F838C0477FB8EEE41AA983EA156513D24D417A4E932F35BB7FC84013B266A266864F';
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
    .addStringOption(option => option.setName('information').setDescription('Information about the request').setRequired(true))
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

    const channel = client.channels.cache.get('');
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

    const channel = client.channels.cache.get('');
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
      color: 0x0000ff, // Blue color
      title: 'Looking for a Friendly!',
      description: `${interaction.user} is looking for a friendly`,
      fields: [
        { name: 'Team Name', value: teamName },
        { name: 'Information', value: information },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Friendly Request',
      },
    };

    const channel = client.channels.cache.get('');
    if (channel) {
      await channel.send({ embeds: [embed] });
      await channel.send('<@&1260910227184943238> ^^^^^');
      await interaction.reply({ content: 'Friendly request submitted!', ephemeral: true });

      usedFriendlyCommand.add(interaction.user.id);
      setTimeout(() => {
        usedFriendlyCommand.delete(interaction.user.id);
      }, 3600000); // 1 hour in milliseconds
    } else {
      await interaction.reply({ content: 'Failed to find the specified channel.', ephemeral: true });
    }
  }
});

client.login(token);

// Function to update status and send messages
async function updateStatusAndSendMessages() {
  if (currentIndex >= statusMessages.length) {
    currentIndex = 0;
  }

  const status = statusMessages[currentIndex];
  await client.user.setActivity(status, { type: ActivityType.Watching });
  console.log(`🤖 Bot status updated: ${status}`);
  currentIndex++;
  const channel = client.channels.cache.get('YOUR_CHANNEL_ID');
  if (channel && channel instanceof TextChannel) {
    const messagePath = path.join(__dirname, 'messages', `${currentIndex}.txt`);
    if (fs.existsSync(messagePath)) {
      const message = fs.readFileSync(messagePath, 'utf-8');
      await channel.send(message);
    }
  }
}

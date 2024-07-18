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
const robloxCookie = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_85EA7219A2526588AB6C753FE15960A0F3C4525E98A355925CB4BB5759075E9FDA3F11216A45ED16DC5BA0C0DED3BEAC583FFE653938D264A6C90DCF1E8514BF00BE01EB2625FBCE5CECF495E97FCBB1F14AFDBC3842BE2945B0080132E420EAA852588F194C849FE9D48172A1B317531A99DFA4E26E496B347E37879F2463DA67E9F2BBFD4638C5F6CCE8C437B4DACAB9ED5F2A03481C353C0D8508681D8E712D2B7BCC6312C456D981A902B3D75DCFBCE47A792174FBE256076BC5D664512DC57B9FB881E1E9CE62C64BF21B8E698FD039E4647C634960AF42AC987D3D3E9BF0ED0C34621D05D253C60B218A7DAEFA286B09D1C18A0639D47BE1FDE947AFDEB7B4A9B5CDA870FC1FEF38529F629C90D670AA50517D3A7FD4BC16406818AB00510DCE3F07CF77A516909B8E37B694E11210140F0E1FC9A885E8CBF8F953ACEFD801562CCE09A4E0E1A05C84623518E381B58F1C499871FF7E5CFB865BD4A63CE42DFF6F797A73BF4951B3D4720E2312D57FABB5D7D996AB54FB0C09D7C3ADB8891BB48E6337FFAAC0A51BE4D32A995B2B52F83D027D1D7621E1198AEE85CDED27EEB056D86A33E7A0938DBF8934E305B7F52F4F85C0F2BE6DDD8D90C87C9E69ACD766CE503719EA0B5A95C8DCAF2ED0BB626C945F04C4B65B79C3D89151EA4581769CD66BBD2F2B54FEB761FFF00F0BA4B0F0CCA6273C1CECBA611921681E4C1B053C67F5ECD30B60D83C888E0D4F227B631E44AA0DC39FBE1E3E9372B01E987EFD2E057F7B3978EB117DC82F839AD838527B1CD1AD625AD648639F8BFDE53C40891AD257529A4090C68B328E4A7941D6D881B246F673B478563D61E76D843022E8ABDADD25E66182FDCB0B75DDC9B74CC9713BBBF3FBB2BEF740A1390FD5003A72F828BA5ABD0D9ADC9D59372E7F15A5F563F41F2E39F0F85007679D98394DFD649E858AEDE3DCB81021221C2ECC857E3C175826730A2348D0547AA6ED1F3D176E14121989A2044EA4B98569D9F19DA90C7583BB792AF0F13C60D0654D4E89EDCEC55D47D222F6C045835881B92A9A9E92D32CDF24255B9CECEE3049F977572221F89E';
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

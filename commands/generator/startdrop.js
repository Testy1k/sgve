const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const config = require('../../config.json'); // Adjust the path based on your project structure

module.exports = {
  name: 'startdrop',
  description: 'Start a drop session',
  execute(message) {
    // Check if the command is used in the allowed channel
    const allowedChannelId = config.dropChannelId;
    if (message.channel.id !== allowedChannelId) {
      const channelErrorEmbed = new MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription(`This command can only be used in the <#${allowedChannelId}> channel.`);

      return message.channel.send(channelErrorEmbed);
    }

    // Check if the user has the required role to use the command
    const staffRoleIds = config.staffRoleIds; // Replace with your actual staff role IDs
    const hasStaffRole = message.member.roles.cache.some(role => staffRoleIds.includes(role.id));

    if (!hasStaffRole) {
      const roleErrorEmbed = new MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('You do not have permission to use this command.');

      return message.channel.send(roleErrorEmbed);
    }

    // Check if drop session is already active
    if (config.dropSessionActive) {
      const errorEmbed = new MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('A drop session is already in progress.');

      return message.channel.send(errorEmbed);
    }

    // Update dropSessionActive status to true in config.json
    config.dropSessionActive = true;
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

    // Continue with your logic for starting a drop session
    // ...

    // Send success message
    const successEmbed = new MessageEmbed()
      .setColor('#00FF00')
      .setTitle('Drop Started!')
      .setDescription('A new drop session has started! Hurry up and get the drops!!');

     message.channel.send('<@&1158821364292137030>');
    message.channel.send(successEmbed);
  },
};

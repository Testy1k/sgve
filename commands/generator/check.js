const fs = require('fs');
const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'check',
  description: 'Check if a user has a verified message in the log.',

  execute(message, args, usedPrefix) {
    // Check if the user has mentioned someone
    const targetUser = message.mentions.users.first();

    if (!targetUser) {
      return message.reply('Please mention a user.');
    }

    // Read the contents of the log file
    const logPath = 'verified.txt';
    const logContent = fs.readFileSync(logPath, 'utf8').split('\n');

    // Check if there's a line containing the target user's username
    const isVerified = logContent.some(line => line.includes(targetUser.username));

    // Create the embed
    const embed = new Discord.MessageEmbed()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

    // Set embed fields based on verification status
    if (isVerified) {
      // Remove the line containing the target user's username from the log file
      const updatedLogContent = logContent.filter(line => !line.includes(targetUser.username));
      fs.writeFileSync(logPath, updatedLogContent.join('\n'));

      embed.setColor('#00ff00') // Green color for verified
        .setTitle(`VERIFIED`)
        .setDescription(`The user ${targetUser} is verified to redeem codes`);
    } else {
      embed.setColor('#ff0000') // Red color for not verified
        .setTitle(`NOT VERIFIED`)
        .setDescription(`The user ${targetUser} is not verified to redeem codes`);
    }

    // Send the embed
    message.channel.send(embed);
  },
};

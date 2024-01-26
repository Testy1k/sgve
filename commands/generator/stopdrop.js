      const { MessageEmbed } = require('discord.js');
      const fs = require('fs');
      const config = require('../../config.json'); // Adjust the path based on your project structure

      module.exports = {
        name: 'stopdrop',
        description: 'Stop the current drop session',
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

          // Check if drop session is active
          if (!config.dropSessionActive) {
            const errorEmbed = new MessageEmbed()
              .setColor('#FF0000')
              .setTitle('Error')
              .setDescription('No drop session is currently active.');

            return message.channel.send(errorEmbed);
          }

          // Continue with your logic for stopping a drop session
          // ...

          // Update dropSessionActive status to false in config.json
          config.dropSessionActive = false;
          fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

          // Send success message
          const successEmbed = new MessageEmbed()
            .setColor('#00FF00')
            .setTitle('Drop Stopped')
            .setDescription('The drop session has stopped.');

          message.channel.send(successEmbed);
        },
      };

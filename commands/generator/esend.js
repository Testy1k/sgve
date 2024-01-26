const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const config = require('../../config.json');

module.exports = {
  name: 'esend',
  description: 'Send a payout message to a user with the specified details.',
  usage: '.esend @user {5letters and numbers any} anything 1:anything 2',

  execute(message) {
    // Check if the user has the required role
    const epayRole = message.guild.roles.cache.get(config.epayroleId);
    if (!epayRole || !message.member.roles.cache.has(epayRole.id)) {
      return message.channel.send(
        new MessageEmbed()
          .setColor(config.color.red)
          .setTitle('Permission Denied!')
          .setDescription('You do not have the required role to use this command.')
          .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
          .setTimestamp()
      );
    }

    // Extract user mention and code from message content using regex
    const match = message.content.match(/^\.esend\s+<@(\d+)>\s+{([^}]+)}\s+(\S+)\s*:\s*(\S+)/);

    // Validate the match result
    if (!match || match.length < 5) {
      return message.channel.send(
        new MessageEmbed()
          .setColor(config.color.red)
          .setTitle('Invalid Syntax!')
          .setDescription(`Usage: \`${config.prefix}esend @user {5letters and numbers any} anything 1:anything 2\``)
          .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
          .setTimestamp()
      );
    }

    // Destructure the match result
    const [, userMention, code, anything1, anything2] = match;

    // Convert userMention to a User object
    const targetUser = message.guild.members.cache.get(userMention).user;

    // Read extremepay.txt file
    const payoutFilePath = `${__dirname}/../../extremepay.txt`;
    fs.readFile(payoutFilePath, 'utf8', function (error, data) {
      if (error) {
        console.error(error);
        return message.channel.send(
          new MessageEmbed()
            .setColor(config.color.red)
            .setTitle('Error Reading File!')
            .setDescription('An error occurred while reading the payout file.')
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
      }

      // Check if the code is present in the file
      const regex = new RegExp(`^${code}\\s*-\\s*(.+)$`, 'm');
      const match = data.match(regex);

      if (match && match[1]) {
        const service = match[1].trim();

        // Remove the code from the file
        data = data.replace(match[0], '');

        // Write the updated data back to the file
        fs.writeFile(payoutFilePath, data, function (error) {
          if (error) {
            console.error(error);
            return message.channel.send(
              new MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Error Writing File!')
                .setDescription('An error occurred while updating the payout file.')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
          }

          // Send DM to the mentioned user with payout details
          const payoutEmbed = new MessageEmbed()
            .setColor(config.color.green)
            .setTitle('Payout Details')
            .setDescription(
              `**Payouted by:** ${message.author}\n\n**Service:** \`\`\`${service}\`\`\`\n\n**Username/Email:** \n\`\`\`${anything1}\`\`\`\n\n**Password:** \n\`\`\`${anything2}\`\`\`\n\n**Combo:** \n\`\`\`${anything1}:${anything2}\`\`\``
            )
            .setFooter('Please vouch the payer if it works or open a ticket if there are issues.')
            .setTimestamp();

          targetUser.send(payoutEmbed).catch((err) => {
            console.error(`Failed to send DM to ${targetUser.tag}: ${err}`);
            return message.channel.send(
              new MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Error Sending DM!')
                .setDescription(`An error occurred while sending the payout details to ${targetUser}.`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
          });

          // Inform the user in the server
          return message.channel.send(
            new MessageEmbed()
              .setColor(config.color.green)
              .setTitle('Payout Sent Successfully!')
              .setDescription(`Payout details sent to ${targetUser} successfully.`)
              .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
              .setTimestamp()
          );
        });
      } else {
        // Code not found in the file
        return message.channel.send(
          new MessageEmbed()
            .setColor(config.color.red)
            .setTitle('Code Not Found!')
            .setDescription(`The code \`${code}\` was not found in the payout file.`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
      }
    });
  },
};

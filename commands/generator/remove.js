const { MessageAttachment, MessageEmbed } = require('discord.js');
const fs = require('fs');
const config = require('../../config.json');

module.exports = {
    name: 'remove',
    description: 'Remove a service.',
    adminUserIds: config.adminUserIds,
  

    execute: function (message, args, usedPrefix) {
      // Check if the user has the restock role
      const restockRoleId = config.restockroleid;
      if (!message.member.roles.cache.has(restockRoleId)) {
          return message.reply('You do not have the necessary permissions to use this command.');
      }

        // Parameters
        const keyword = args[0] ? args[0].toLowerCase() : undefined; // 'free', 'prem', 'boost', or 'basic'
        const serviceName = args[1];

        // If the "keyword" or "serviceName" parameter is missing
        if (!keyword || !serviceName) {
            return message.channel.send(
                new MessageEmbed()
                    .setColor(config.color.red)
                    .setTitle('Missing parameters!')
                    .setDescription('You need to specify both the keyword ("free", "premium", "boost", or "basic") and a service name!')
                    .addField('For example', `${config.genPrefix}${this.name} free serviceName`)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
            );
        }

        let folderType;

        // Determine folder type based on the keyword
        if (keyword === 'free') {
            folderType = 'fstock';
        } else if (keyword === 'premium') {
            folderType = 'stock';
        } else if (keyword === 'boost') {
            folderType = 'bstock';
        } else if (keyword === 'basic') {
            folderType = 'basicstock';
        } else {
            return message.channel.send(
                new MessageEmbed()
                    .setColor(config.color.red)
                    .setTitle('Invalid keyword!')
                    .setDescription('You need to specify a valid keyword ("free", "premium", "boost", or "basic").')
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
            );
        }

        const serviceFileName = `${serviceName.toLowerCase()}.txt`; // Service filename (always .txt)
        const folderPath = `${__dirname}/../../${folderType}/`;

        try {
            const filePath = `${folderPath}${serviceFileName}`;

            // Check if the service file exists
            if (fs.existsSync(filePath)) {
                // Read the content of the service file
                const fileContent = fs.readFileSync(filePath, 'utf-8');

                // Notify that the service has been removed
                const embedStockId = new MessageEmbed()
                    .setColor(config.color.green)
                    .setTitle('Service Removed!')
                    .setDescription(`The service \`${serviceName}\` has been removed in the ${keyword} category.`)
                    .setFooter(message.author.tag, message.author.displayAvatarURL());

                // Send the embed to the stockid channel
                const stockidChannel = message.guild.channels.cache.get(config.stockid);
                if (stockidChannel) {
                    stockidChannel.send(embedStockId);
                } else {
                    console.error('stockid channel not found.');
                }

                // Remove the service file
                fs.unlinkSync(filePath);

                // Send a confirmation message to the current channel with a file attachment
                const fileAttachment = new MessageAttachment(Buffer.from(fileContent), `${serviceName}.txt`);
                message.channel.send(
                    'Service removed. Check the stockid channel for details.',
                    { files: [fileAttachment] }
                );
            } else {
                // Service file doesn't exist
                message.channel.send(
                    new MessageEmbed()
                        .setColor(config.color.red)
                        .setTitle('Service not found!')
                        .setDescription(`The service \`${serviceName}\` does not exist in \`${folderType}\` folder.`)
                        .setFooter(message.author.tag, message.author.displayAvatarURL())
                );
            }
        } catch (error) {
            console.error(error);
            message.channel.send(
                new MessageEmbed()
                    .setColor(config.color.red)
                    .setTitle('An error occurred!')
                    .setDescription('An error occurred while processing the command.')
                    .setFooter(message.author.tag, message.author.displayAvatarURL())
            );
        }
    },
};

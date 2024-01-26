const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'help',
    description: 'Display the command list.',


    execute(message, usedPrefix) {
        const helpEmbed = new MessageEmbed()
            .setColor(config.color.default)
            .setTitle('Command list')
            .setDescription(`\`\`.bgen\`\`: Generate a specified basic service if stocked\n\`\`.bsgen\`\`: Generate a specified booster service if stocked\n\`\`.fgen\`\`: Generate a specified free service if stocked.\n\`\`.gen\`\`: Generate a specified service if stocked.\n\`\`.stock\`\`: Display the service stock.\n\`\`=help\`\`: Display the command list.\n\`\`+vouch\`\`: Vouch for a user.\n\`\`-vouch\`\`: NegVouch for a user.`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp();

        message.channel.send(helpEmbed);
    },
};

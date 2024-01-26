const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'cookie',
    description: 'Instructions for using a Netflix cookie',

    execute(message, args, usedPrefix) {
        const cookieEmbed = new Discord.MessageEmbed()
            .setColor('#3498db')
            .setTitle('How to Use a Netflix Cookie:')
            .setDescription('Step 1: Make sure you are on a PC\n' +
                'Step 2: Download the extension called Cookie Editor [link](https://cookie-editor.com/)\n' +
                'Step 3: Go to the Netflix website and pin Cookie Editor\n' +
                'Step 4: Delete all cookies (the bin icon) and then press import and copy the thing we gave you\n' +
                'Step 5: After import, just click refresh on the whole page, and you should be logged in\n' +
                'Step 6: Enjoy!!!')
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp();

        message.channel.send(cookieEmbed);
    },
};

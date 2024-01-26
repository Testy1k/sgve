
const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'verify',
    description: 'Provides information on how to verify',

    execute(message, args, config, vouches, usedPrefix) {
        const verificationLink = 'https://link-hub.net/1090286/galaxy-gen-verify1';

        const verifyEmbed = new MessageEmbed()
            .setColor('#3498db') // You can change the color
            .setTitle('🔒 Verify using this link:')
            .setDescription(
                `✅ Step 1: Click [here to verify](${verificationLink})\n` +
                '✅ Step 2: Choose "Free Access with Ads."\n' +
                '✅ Step 3: You will be redirected to a Google Form.\n' +
                '✅ Step 4: Enter your Discord username and submit the form!\n\n' +
                '🌟 Congratulations, you\'re now verified and ready to enjoy our server to the fullest! If you encounter any issues, feel free to ask for assistance. We\'re here to help! 🔆'
            );

        message.channel.send(verifyEmbed);
    },
};

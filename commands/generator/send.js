const fs = require('fs').promises;
const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

// Map to store cooldowns for each user
const cooldowns = new Map();

module.exports = {
    name: 'send',
    description: 'Netflix access',
    usage: 'send <@user>',
    execute: async (message, args, usedPrefix) => {
        // Check if the user has the required role to use this command
        const allowedRoles = config.cookiesendroles;
        const hasAllowedRole = message.member.roles.cache.some(role => allowedRoles.includes(role.id));

        if (!hasAllowedRole) {
            // Send a cooldown message in an embed
            return sendCooldownMessage(message, 'You do not have the necessary role to use this command.');
        }

        // Check cooldown
        const cooldownKey = `${message.author.id}_${module.exports.name}`;
        const cooldownTime = checkCooldown(cooldownKey);

        if (cooldownTime > 0) {
            // Send a cooldown message in an embed with the remaining cooldown time in minutes
            return sendCooldownMessage(message, `This command is on cooldown. Please wait ${cooldownTime} minute(s).`);
        }

        try {
            // Get the mentioned user
            const targetUser = message.mentions.users.first();

            // Check if a user was mentioned
            if (!targetUser) {
                return sendCooldownMessage(message, 'Please mention a user to send the Netflix access to.');
            }

            // Get a random file from the ./netflix folder
            const netflixFolder = './netflix';
            const files = await fs.readdir(netflixFolder);

            if (files.length === 0) {
                // Send a cooldown message in an embed
                return sendCooldownMessage(message, 'OUT OF STOCK');
            }

            const randomFileName = files[Math.floor(Math.random() * files.length)];
            const filePath = `${netflixFolder}/${randomFileName}`;

            // Create an embed for the direct message
            const dmEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Netflix Access')
                .setDescription(`🌕 **${config.serverName}** 🌕\n\n**Service**\n💻 Here is your Netflix access`)
                .addField('Instructions', `Step 1: Make sure you are on a PC\nStep 2: Download the extension called Cookie Editor [link](https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm)\nStep 3: Go to the Netflix website and pin Cookie Editor\nStep 4: Delete all cookies (the bin icon) and then press import and copy the thing we gave you\nStep 5: After import, just click refresh on the whole page, and you should be logged in\nStep 6: Enjoy!!!\n\nEnjoy at Netflix!`);

            // Send the embed as a direct message to the mentioned user (targetUser)
            targetUser.send(dmEmbed).catch((err) => {
                console.error(`Failed to send DM to ${targetUser.tag}: ${err}`);
            });

            // Send the file to the mentioned user (targetUser)
            await targetUser.send({ files: [{ attachment: filePath, name: randomFileName }] });

            // Send a confirmation message to the channel
            message.channel.send(
                new MessageEmbed()
                    .setColor(config.color.green)
                    .setTitle('Netflix Access Sent!')
                    .setDescription(`Check ${targetUser.tag}'s private messages! If they do not receive the message, please ask them to unlock their private!`)
                    .setImage(config.gif) // Use the URL from config.json
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
            );

            // Remove the sent file
            await fs.unlink(filePath);

            // Set cooldown for 3 minutes (180,000 milliseconds)
            setCooldown(cooldownKey, 180000);
        } catch (error) {
            console.error(error);

            // Send a cooldown message in an embed
            sendCooldownMessage(message, 'An error occurred while processing the send command.');
        }
    },
};

function sendCooldownMessage(message, content) {
    const cooldownEmbed = new MessageEmbed()
        .setColor(config.color.red)
        .setTitle('Cooldown')
        .setDescription(content)
        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
        .setTimestamp();

    return message.channel.send(cooldownEmbed);
}

function setCooldown(key, time) {
    cooldowns.set(key, Date.now() + time);
}

function checkCooldown(key) {
    const cooldownEnd = cooldowns.get(key);
    if (!cooldownEnd) return 0;

    const remainingTime = cooldownEnd - Date.now();
    const remainingMinutes = Math.ceil(remainingTime / (1000 * 60)); // Convert milliseconds to minutes
    return Math.max(0, remainingMinutes);
}

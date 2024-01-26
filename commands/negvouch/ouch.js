// commands/ouch/ouch.js
const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('vouches.db');

module.exports = {
    name: 'ouch',
    description: 'Ouch a user.',
    execute(message, args, prefix) {
        if (!message.mentions.users.size) {
            return message.channel.send(`Usage: ${prefix}ouch @user {reason}`);
        }

        const mentionedUser = message.mentions.users.first();
        const reason = args.slice(1).join(' ');

        db.run(`INSERT OR IGNORE INTO vouches (user_id) VALUES (?)`, [mentionedUser.id]);
        db.run(`UPDATE vouches SET negvouches = negvouches + 1, todayvouches = todayvouches + 1, last3daysvouches = last3daysvouches + 1, lastweekvouches = lastweekvouches + 1 WHERE user_id = ?`, [mentionedUser.id]);
        db.run(`UPDATE vouches SET reasons = json_insert(reasons, '$[0]', ?) WHERE user_id = ?`, [reason, mentionedUser.id]);

        const ouchEmbed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('❌Negative Review')
            .setDescription(`Succesfully Negvouched for ${mentionedUser.tag} ${reason ? `with reason: ${reason}` : ''}`);

        message.channel.send(ouchEmbed);
    },
};

const { MessageEmbed } = require('discord.js');
const fs = require('fs').promises;
const config = require('../../config.json');

module.exports = {
  name: 'stock',
  description: 'Display the service stock.',


  execute: async (message, usedPrefix) => {
    try {
      const freeStock = await readDirectory(`${__dirname}/../../fstock/`);
      const premiumStock = await readDirectory(`${__dirname}/../../stock/`);
      const boosterStock = await readDirectory(`${__dirname}/../../bstock/`);
      const basicStock = await readDirectory(`${__dirname}/../../basicstock/`);

      const embed = new MessageEmbed()
        .setColor(config.color.default)
        .setTitle(`${message.guild.name} Service Stock`)
        .addField('FREE STOCK', freeStock.join('\n') || 'No services', true)
        .addField('PREMIUM STOCK', premiumStock.join('\n') || 'No services', true)
        .addField('BOOSTER STOCK', boosterStock.join('\n') || 'No services', true)
        .addField('BASIC STOCK', basicStock.join('\n') || 'No services', true);

      message.channel.send({ embed: embed });
    } catch (error) {
      console.error(error);
      message.channel.send('An error occurred while processing the stock command.');
    }
  },
};

async function readDirectory(directoryPath) {
  try {
    const files = await fs.readdir(directoryPath);
    const stock = [];

    for (const file of files) {
      if (file.endsWith('.txt')) {
        const acc = await fs.readFile(`${directoryPath}/${file}`, 'utf-8');
        const lines = acc.split(/\r?\n/).filter(Boolean);
        stock.push(file.replace('.txt', ''));
      }
    }

    return stock;
  } catch (error) {
    console.error(`Unable to read directory ${directoryPath}: ${error}`);
    return [];
  }
}

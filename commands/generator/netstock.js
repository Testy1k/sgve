const fs = require('fs').promises;
const fetch = require('node-fetch/lib/index.js');
const config = require('../../config.json');

module.exports = {
    name: 'netstock',
    description: 'Extract and add files from a zip attachment to the Netflix folder',

    execute: async (message, usedPrefix) => {
        // Create the temp directory if it doesn't exist
        const tempDir = './temp';

        try {
            await fs.access(tempDir); // Use fs.promises.access
        } catch (err) {
            // Handle error or create the directory
            if (err.code === 'ENOENT') {
                await fs.mkdir(tempDir);
            } else {
                console.error('Error accessing temp directory:', err.message);
                return message.reply('An error occurred while accessing the temp directory.');
            }
        }

        // Check if the user has the restock role
        const restockRoleId = config.restockroleid;
        if (!message.member.roles.cache.has(restockRoleId)) {
            return message.reply('You do not have the necessary permissions to use this command.');
        }

        // Check if a zip file is attached
        if (message.attachments.size !== 1 || !message.attachments.first().name.endsWith('.zip')) {
            return message.reply('Please attach a single .zip file.');
        }

        // Get the attached zip file
        const attachment = message.attachments.first();
        const zipFilePath = `${tempDir}/${attachment.name}`;

        try {
            // Download the zip file
            const response = await fetch(attachment.url);
            const buffer = await response.buffer();

            // Corrected line: Use fs.writeFile to save the buffer to the file
            await fs.writeFile(zipFilePath, buffer);

            // Extract the contents of the zip file to the ./netflix folder
            await extractZip(zipFilePath, './netflix');

            message.reply('Netflix has been restocked successfully.');
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while processing the zip file.');
        } finally {
            // Remove the temporary zip file
            await fs.unlink(zipFilePath);
        }
    },
};

async function extractZip(zipFilePath, targetFolder) {
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(zipFilePath);

    // Iterate over each entry in the zip file
    zip.getEntries().forEach((entry) => {
        // Check if the entry is a file (not a directory)
        if (!entry.isDirectory) {
            // Extract the entry to the target folder with its entry name
            const entryName = entry.entryName.split('/').pop(); // Get the entry name without any directory structure
            zip.extractEntryTo(entry, targetFolder, false, true, entryName);
        }
    });
}

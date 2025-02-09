module.exports = async (context) => {
    const { client, m } = context;
    const { Catbox } = require("node-catbox");
    const fs = require('fs-extra');
    const { downloadAndSaveMediaMessage } = require('@whiskeysockets/baileys');

    // Initialize Catbox
    const catbox = new Catbox();

    // Function to upload a file to Catbox and return the URL
    async function uploadToCatbox(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error("File does not exist");
        }
        try {
            const uploadResult = await catbox.uploadFile({ path: filePath });
            if (uploadResult) {
                return uploadResult;
            } else {
                throw new Error("Error retrieving file link");
            }
        } catch (error) {
            throw new Error(String(error));
        }
    }

    // Check if the message is quoted
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime) return m.reply('Please quote an image, video, sticker, or any other media.');

    let mediaPath;

    try {
        // Download and save the media (image, video, sticker, gif, etc.)
        mediaPath = await downloadAndSaveMediaMessage(q);

        // Upload the media to Catbox and get the URL
        const fileUrl = await uploadToCatbox(mediaPath);

        // Delete the local media file after upload
        fs.unlinkSync(mediaPath);

        // Respond with the URL of the uploaded file
        m.reply(`Here is your uploaded media: ${fileUrl}`);
    } catch (error) {
        console.error("Error while creating your URL:", error);
        m.reply("Oops, there was an error uploading the media.");
    }
};

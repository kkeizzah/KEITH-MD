module.exports = async (context) => {
    const { client, m } = context;
    const { Catbox } = require("node-catbox");
    const fs = require('fs-extra');
    const { downloadAndSaveMediaMessage } = require('@whiskeysockets/baileys');

    const catbox = new Catbox();

    // Function to upload media to Catbox
    async function uploadToCatbox(filePath) {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error("File does not exist.");
            }
            const uploadResult = await catbox.uploadFile({ path: filePath });
            if (uploadResult) {
                return uploadResult;
            } else {
                throw new Error("Error retrieving file link.");
            }
        } catch (error) {
            console.error("Error in uploadToCatbox:", error.message);
            throw error;
        }
    }

    // Get the quoted message or the original message
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime) {
        return m.reply('Please quote an image, video, sticker, or any other media.');
    }

    try {
        // Download and save media
        const mediaBuffer = await downloadAndSaveMediaMessage(q);
        const mediaPath = mediaBuffer.path; // Ensure you have the correct path to the media file
        
        if (!mediaPath) {
            throw new Error("Failed to download the media.");
        }

        console.log("Media downloaded:", mediaPath);

        // Upload the downloaded media to Catbox
        const fileUrl = await uploadToCatbox(mediaPath);
        console.log("File uploaded, URL:", fileUrl);

        // Delete the media file after uploading
        fs.unlinkSync(mediaPath); // Correctly remove the file by path

        // Reply with the uploaded file URL
        m.reply(`Here is your uploaded media: ${fileUrl}`);
    } catch (error) {
        console.error("Error in processing media:", error.message);
        m.reply(`Oops, there was an error: ${error.message}`);
    }
};

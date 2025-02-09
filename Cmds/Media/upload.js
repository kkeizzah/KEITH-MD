const { Catbox } = require("node-catbox");
const fs = require('fs-extra');
const util = require("util");

module.exports = async (context) => {
    const { client, m } = context;
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
        const mediaBuffer = await q.download();
        if (mediaBuffer.length > 10 * 1024 * 1024) {
            return m.reply('Media is too large. Please send media smaller than 10MB.');
        }

        let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);

        if (isTele) {
            // Save the media to a file
            let filePath = await client.downloadAndSaveMediaMessage(q);

            // Upload the file to Catbox
            let link = await uploadToCatbox(filePath);

            // Calculate file size
            const fileSizeMB = (mediaBuffer.length / (1024 * 1024)).toFixed(2);

            // Respond with the media link
            m.reply(`Media Link: ${link}\nFile Size: ${fileSizeMB} MB`);
        } else {
            m.reply('Unsupported media type. Please send a valid image or video.');
        }
    } catch (error) {
        console.error("Error in processing media:", error.message);
        m.reply('An error occurred while processing the media. Please try again.');
    }
};


const fs = require('fs');
const Catbox = require("node-catbox");// Ensure the Catbox library is correctly imported

const catbox = new Catbox();

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
    console.error('Error uploading file to Catbox:', error);
    throw error;
  }
}

module.exports = uploadToCatbox;
 

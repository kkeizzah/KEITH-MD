
const fs = require("fs");
const path = require("path");
const util = require("util");

module.exports = async (context) => {
  const { client, m, uploadtoimgur } = context;

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  if (!mime) return m.reply('Quote an image, video, or other media');

  let mediaBuffer = await q.download();

  if (mediaBuffer.length > 10 * 1024 * 1024) return m.reply('Media is too large.');

  // Check if the media type is supported
  let isSupported = /image\/(png|jpe?g|gif)|video\/mp4|audio\/.*/.test(mime);

  if (isSupported) {
    let fta2 = await client.downloadAndSaveMediaMessage(q);
    let link = await uploadtoimgur(fta2);

    const fileSizeMB = (mediaBuffer.length / (1024 * 1024)).toFixed(2);

    m.reply(`Media Link:\n\n${link}\n\nFile Size: ${fileSizeMB} MB`);
  } else {
    m.reply('Error occurred. Unsupported media type.');
  }
};

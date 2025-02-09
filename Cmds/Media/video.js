const axios = require('axios');
const ytSearch = require('yt-search');

module.exports = async (context) => {
  const { client, m, text } = context;

  const query = text;
  try {
    // Ensure the query is provided
    if (!query) {
      return m.reply("What video do you want to download?");
    }

    // Perform the search using yt-search
    const searchResults = await ytSearch(query);

    // Check if any videos were found
    if (!searchResults || !searchResults.videos.length) {
      return m.reply('No video found for the specified query.');
    }

    const firstVideo = searchResults.videos[0];
    const videoUrl = firstVideo.url;

    // Function to get download data from APIs
    const getDownloadData = async (url) => {
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        console.error('Error fetching data from API:', error);
        return { success: false };
      }
    };

    // List of APIs to try for downloading
    const apis = [
      `https://api-rin-tohsaka.vercel.app/download/ytmp4?url=${encodeURIComponent(videoUrl)}`,
      `https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(videoUrl)}`,
      `https://www.dark-yasiya-api.site/download/ytmp4?url=${encodeURIComponent(videoUrl)}`,
      `https://api.giftedtech.web.id/api/download/dlmp4?url=${encodeURIComponent(videoUrl)}`,
      `https://api.dreaded.site/api/ytdl/video?url=${encodeURIComponent(videoUrl)}`
    ];

    // Loop through APIs and fetch download data
    let downloadData;
    for (const api of apis) {
      downloadData = await getDownloadData(api);
      if (downloadData && downloadData.success) {
        break;
      }
    }

    // Check if a valid download URL was found
    if (!downloadData || !downloadData.success) {
      return m.reply('Failed to retrieve download URL from all sources. Please try again later.');
    }

    const downloadUrl = downloadData.result.download_url;
    const videoDetails = downloadData.result;

    // Prepare the message payload with external ad details
    const messagePayload = {
      video: { url: downloadUrl },
      mimetype: 'video/mp4',
      contextInfo: {
        externalAdReply: {
          title: videoDetails.title,
          body: videoDetails.title,
          mediaType: 1,
          sourceUrl: 'https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47',
          thumbnailUrl: firstVideo.thumbnail,
          renderLargerThumbnail: false,
          showAdAttribution: true,
        },
      },
    };

    // Send the download link to the user
    await client.sendMessage(m.chat, messagePayload, { quoted: m });

  } catch (error) {
    console.error('Error during download process:', error);
    return m.reply(`Download failed due to an error: ${error.message || error}`);
  }
};

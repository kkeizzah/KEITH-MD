

const axios = require('axios');
const Heroku = require('heroku-client');
const herokuapi = process.env.HEROKU_API_KEY;
const appname = process.env.HEROKU_APP_NAME || 'heroku-app-nsmw';

module.exports = async (context) => {
  const { m, text, Owner } = context;

  if (!Owner) {
    return m.reply("*This command is restricted to the bot owner or Alpha owner 💀*");
  }

  // Ensure Heroku app name and API key are set
  const herokuAppName = appname;
  const herokuApiKey = herokuapi;

  // Check if Heroku app name and API key are set in environment variables
  if (!herokuAppName || !herokuApiKey) {
    await m.reply("It looks like the Heroku app name or API key is not set. Please make sure you have set the `HEROKU_APP_NAME` and `HEROKU_API_KEY` environment variables.");
    return;
  }

  // Function to redeploy the app
  async function redeployApp() {
    try {
      const response = await axios.post(
        `https://api.heroku.com/apps/${herokuAppName}/builds`,
        {
          source_blob: {
            url: "https://github.com/Keithkeizzah/KEITH-MD/tarball/main",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${herokuApiKey}`,
            Accept: "application/vnd.heroku+json; version=3",
          },
        }
      );

      // Notify the user about the update and redeployment
      await m.reply("*Your bot is getting updated, wait 2 minutes for the redeploy to finish! This will install the latest version of KEITH-MD.*");
      console.log("Build details:", response.data);
    } catch (error) {
      // Handle any errors during the redeployment process
      const errorMessage = error.response?.data || error.message;
      await m.reply(`*Failed to update and redeploy. ${errorMessage} Please check if you have set the Heroku API key and Heroku app name correctly.*`);
      console.error("Error triggering redeploy:", errorMessage);
    }
  }

  // Trigger the redeployment function
  redeployApp();
};

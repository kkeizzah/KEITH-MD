const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from the .env file

module.exports = async (context) => {
  const { m, text, client, Owner } = context;

  // Check if the command is issued by the owner
  if (!Owner) {
    return m.reply("*This command is restricted to the bot owner*");
  }

  // Validate user input and respond accordingly
  if (!text) {
    return m.reply('Instructions:\n\nType "anticall true" to enable or "anticall false" to disable.');
  }

  const option = text.toLowerCase();
  let responseMessage;

  switch (option) {
    case "true":
      // Enable Anti-Call
      process.env.ANTICALL = 'true';  // Update in memory (won't persist in the .env file directly)
      responseMessage = 'Anti-call has been enabled.';
      break;

    case "false":
      // Disable Anti-Call
      process.env.ANTICALL = 'false';  // Update in memory
      responseMessage = 'Anti-call has been disabled.';
      break;

    default:
      return m.reply("Please don't invent an option. Type 'anticall true' or 'anticall false'.");
  }

  // Optionally, if you want to save the change to the .env file:
  try {
    // Save the updated anticall value to the .env file
    let envContent = fs.readFileSync('.env', 'utf-8');
    const updatedEnvContent = envContent.replace(/ANTICALL=\w+/g, `ANTICALL=${process.env.ANTICALL}`);
    fs.writeFileSync('.env', updatedEnvContent, 'utf-8');

    // Send the response message to the user
    await client.sendMessage(m.chat, { text: responseMessage }, { quoted: m });
  } catch (error) {
    console.error("Error processing your request:", error);
    await client.sendMessage(m.chat, { text: 'Error processing your request.' }, { quoted: m });
  }
};

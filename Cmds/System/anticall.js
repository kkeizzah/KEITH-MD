const fs = require('fs');

module.exports = async (context) => {
  const { m, text, client, Owner, anticall } = context;

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
      responseMessage = 'Anti-call has been enabled.';
      break;

    case "false":
      // Disable Anti-Call
      responseMessage = 'Anti-call has been disabled.';
      break;

    default:
      return m.reply("Please don't invent an option. Type 'anticall true' or 'anticall false'.");
  }

  // Here, we assume you want to save the `anticall` state to a file or global state.
  // If it's a persistent option, you would save the value (e.g., in a JSON file, database, etc.).
  try {
    // Optional: You can save the state of 'anticall' to a file or database here.
    // Example: fs.writeFileSync('anticall_state.json', JSON.stringify({ anticall }));

    // Send the response message to the user
    await client.sendMessage(m.chat, { text: responseMessage }, { quoted: m });
  } catch (error) {
    console.error("Error processing your request:", error);
    await client.sendMessage(m.chat, { text: 'Error processing your request.' }, { quoted: m });
  }
};

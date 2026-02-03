/*I wrote a script to automate my job. Now I just sit back and watch Netflix while it runs.*/
const fs = require('fs-extra');
const path = require('path');

// Load environment variables
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

// Basic settings
const session = process.env.SESSION || '';
const dev = process.env.OWNER_NUMBER || '254748387615';

// AntiCall settings
const anticallStatus = (process.env.ANTICALL_STATUS || 'false').toLowerCase() === 'true';
const anticallMessage = process.env.ANTICALL_MESSAGE || 'Call me later 🙏';
const anticallAction = process.env.ANTICALL_ACTION || 'reject';

// AntiDelete settings
const antideleteStatus = (process.env.ANTIDELETE_STATUS || 'true').toLowerCase() === 'true';
const antideleteNotification = process.env.ANTIDELETE_NOTIFICATION || ' *Keith antiDelete*';
const antideleteIncludeGroupInfo = (process.env.ANTIDELETE_INCLUDE_GROUP_INFO || 'true').toLowerCase() === 'true';
const antideleteSendToOwner = (process.env.ANTIDELETE_SEND_TO_OWNER || 'true').toLowerCase() === 'true';
const antideleteIncludeMedia = (process.env.ANTIDELETE_INCLUDE_MEDIA || 'true').toLowerCase() === 'true';

// AntiLink settings
const antilinkStatus = process.env.ANTILINK_STATUS || 'off';
const antilinkAction = process.env.ANTILINK_ACTION || 'warn';
const antilinkWarnLimit = parseInt(process.env.ANTILINK_WARN_LIMIT || '3');

// AntiStatusMention settings
const antistatusmentionStatus = process.env.ANTISTATUSMENTION_STATUS || 'warn';
const antistatusmentionAction = process.env.ANTISTATUSMENTION_ACTION || 'warn';
const antistatusmentionWarnLimit = parseInt(process.env.ANTISTATUSMENTION_WARN_LIMIT || '3');

// AutoBio settings
const autobioStatus = process.env.AUTOBIO_STATUS || 'off';
const autobioMessage = process.env.AUTOBIO_MESSAGE || 'KEITH-MD Always active!';

// AutoRead settings
const autoreadStatus = (process.env.AUTOREAD_STATUS || 'false').toLowerCase() === 'true';
const autoreadChatTypes = (process.env.AUTOREAD_CHAT_TYPES || 'private,group').split(',').map(s => s.trim());

// AutoStatus settings
const autostatusAutoviewStatus = process.env.AUTOSTATUS_AUTOVIEW_STATUS || 'true';
const autostatusAutoLikeStatus = process.env.AUTOSTATUS_AUTOLIKE_STATUS || 'false';
const autostatusAutoReplyStatus = process.env.AUTOSTATUS_AUTOREPLY_STATUS || 'false';
const autostatusStatusReplyText = process.env.AUTOSTATUS_STATUS_REPLY_TEXT || '✅ Status Viewed By Keith Md';
const autostatusStatusLikeEmojis = process.env.AUTOSTATUS_STATUS_LIKE_EMOJIS || '💛,❤️,💜,🤍,💙';

// Chatbot settings
const chatbotStatus = process.env.CHATBOT_STATUS || 'off';
const chatbotMode = process.env.CHATBOT_MODE || 'private';
const chatbotTrigger = process.env.CHATBOT_TRIGGER || 'dm';
const chatbotDefaultResponse = process.env.CHATBOT_DEFAULT_RESPONSE || 'text';
const chatbotVoice = process.env.CHATBOT_VOICE || 'Kimberly';

// Greet settings
const greetEnabled = (process.env.GREET_ENABLED || 'false').toLowerCase() === 'true';
const greetMessage = process.env.GREET_MESSAGE || "Hello @user 👋\nWelcome to my chat!\nHow can I help you today?";

// GroupEvents settings
const groupeventsEnabled = (process.env.GROUPEVENTS_ENABLED || 'false').toLowerCase() === 'true';
const groupeventsWelcomeMessage = process.env.GROUPEVENTS_WELCOME_MESSAGE || "Hey @user 👋\nWelcome to *{group}*.\nYou're member #{count}.\nTime: *{time}*\nDescription: {desc}";
const groupeventsGoodbyeMessage = process.env.GROUPEVENTS_GOODBYE_MESSAGE || "Goodbye @user 😔\nLeft at: *{time}*\nMembers left: {count}";
const groupeventsShowPromotions = (process.env.GROUPEVENTS_SHOW_PROMOTIONS || 'true').toLowerCase() === 'true';

// Presence settings
const presencePrivateChat = process.env.PRESENCE_PRIVATE_CHAT || 'off';
const presenceGroupChat = process.env.PRESENCE_GROUP_CHAT || 'off';

// Bot settings
const botPrefix = process.env.BOT_PREFIX || ".";
const botAuthor = process.env.BOT_AUTHOR || "Keith";
const botUrl = process.env.BOT_URL || "https://files.catbox.moe/9zqj7g.jpg";
const botGurl = process.env.BOT_GURL || "https://github.com/Keithkeizzah/KEITH-MD";
const botTimezone = process.env.BOT_TIMEZONE || "Africa/Nairobi";
const botBotname = process.env.BOT_BOTNAME || "KEITH-MD";
const botPackname = process.env.BOT_PACKNAME || "KEITH-MD";
const botMode = process.env.BOT_MODE || "public";
const botSessionName = process.env.BOT_SESSION_NAME || "keith-md";

// Database connection
const { Sequelize } = require('sequelize'); 
const DATABASE_URL = process.env.DATABASE_URL || './database.db'; 

const database = DATABASE_URL === './database.db'
    ? new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
      })
    : new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
          ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
      });

module.exports = {  
  database,
  dev,
  session,
  
  // AntiCall
  anticallStatus,
  anticallMessage,
  anticallAction,
  
  // AntiDelete
  antideleteStatus,
  antideleteNotification,
  antideleteIncludeGroupInfo,
  antideleteSendToOwner,
  antideleteIncludeMedia,
  
  // AntiLink
  antilinkStatus,
  antilinkAction,
  antilinkWarnLimit,
  
  // AntiStatusMention
  antistatusmentionStatus,
  antistatusmentionAction,
  antistatusmentionWarnLimit,
  
  // AutoBio
  autobioStatus,
  autobioMessage,
  
  // AutoRead
  autoreadStatus,
  autoreadChatTypes,
  
  // AutoStatus
  autostatusAutoviewStatus,
  autostatusAutoLikeStatus,
  autostatusAutoReplyStatus,
  autostatusStatusReplyText,
  autostatusStatusLikeEmojis,
  
  // Chatbot
  chatbotStatus,
  chatbotMode,
  chatbotTrigger,
  chatbotDefaultResponse,
  chatbotVoice,
  
  // Greet
  greetEnabled,
  greetMessage,
  
  // GroupEvents
  groupeventsEnabled,
  groupeventsWelcomeMessage,
  groupeventsGoodbyeMessage,
  groupeventsShowPromotions,
  
  // Presence
  presencePrivateChat,
  presenceGroupChat,
  
  // Bot settings
  botPrefix,
  botAuthor,
  botUrl,
  botGurl,
  botTimezone,
  botBotname,
  botPackname,
  botMode,
  botSessionName
};

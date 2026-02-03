const { DataTypes } = require('sequelize');
const { database, presencePrivateChat, presenceGroupChat } = require('../settings');

const PresenceDB = database.define('presence', {
    privateChat: {
        type: DataTypes.STRING,
        defaultValue: presencePrivateChat,
        allowNull: false,
        validate: {
            isIn: [['off', 'online', 'typing', 'recording']]
        }
    },
    groupChat: {
        type: DataTypes.STRING,
        defaultValue: presenceGroupChat,
        allowNull: false,
        validate: {
            isIn: [['off', 'online', 'typing', 'recording']]
        }
    }
}, {
    timestamps: true
});

async function initPresenceDB() {
    try {
        await PresenceDB.sync({ alter: true });
        console.log('Presence table ready');
        
        // Initialize with default values if empty
        const count = await PresenceDB.count();
        if (count === 0) {
            await PresenceDB.create({
                privateChat: presencePrivateChat,
                groupChat: presenceGroupChat
            });
            console.log('Presence defaults initialized from settings');
        }
    } catch (error) {
        console.error('Error initializing Presence table:', error);
        throw error;
    }
}

async function getPresenceSettings() {
    try {
        const settings = await PresenceDB.findOne();
        if (!settings) {
            return await PresenceDB.create({
                privateChat: presencePrivateChat,
                groupChat: presenceGroupChat
            });
        }
        return settings;
    } catch (error) {
        console.error('Error getting presence settings:', error);
        return { 
            privateChat: presencePrivateChat, 
            groupChat: presenceGroupChat 
        };
    }
}

async function updatePresenceSettings(updates) {
    try {
        const settings = await getPresenceSettings();
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating presence settings:', error);
        return null;
    }
}

module.exports = {
    initPresenceDB,
    getPresenceSettings,
    updatePresenceSettings,
    PresenceDB
};

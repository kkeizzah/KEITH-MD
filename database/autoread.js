const { DataTypes } = require('sequelize');
const { database, autoreadStatus, autoreadChatTypes } = require('../settings');

const AutoReadDB = database.define('autoread', {
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: autoreadStatus,
        allowNull: false
    },
    chatTypes: {
        type: DataTypes.JSON,
        defaultValue: autoreadChatTypes,
        allowNull: false
    }
}, {
    timestamps: true
});

async function initAutoReadDB() {
    try {
        await AutoReadDB.sync({ alter: true });
        console.log('AutoRead table ready');
        
        // Initialize with default values if empty
        const count = await AutoReadDB.count();
        if (count === 0) {
            await AutoReadDB.create({
                status: autoreadStatus,
                chatTypes: autoreadChatTypes
            });
            console.log('AutoRead defaults initialized from settings');
        }
    } catch (error) {
        console.error('Error initializing AutoRead table:', error);
        throw error;
    }
}

async function getAutoReadSettings() {
    try {
        const settings = await AutoReadDB.findOne();
        if (!settings) {
            return await AutoReadDB.create({
                status: autoreadStatus,
                chatTypes: autoreadChatTypes
            });
        }
        return settings;
    } catch (error) {
        console.error('Error getting auto-read settings:', error);
        return { 
            status: autoreadStatus, 
            chatTypes: autoreadChatTypes 
        };
    }
}

async function updateAutoReadSettings(updates) {
    try {
        const settings = await getAutoReadSettings();
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating auto-read settings:', error);
        return null;
    }
}

module.exports = {
    initAutoReadDB,
    getAutoReadSettings,
    updateAutoReadSettings,
    AutoReadDB
};

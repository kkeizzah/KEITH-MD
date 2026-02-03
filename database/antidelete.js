const { DataTypes } = require('sequelize');
const { 
  database, 
  antideleteStatus, 
  antideleteNotification, 
  antideleteIncludeGroupInfo, 
  antideleteSendToOwner, 
  antideleteIncludeMedia 
} = require('../settings');

const AntiDeleteDB = database.define('antidelete', {
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: antideleteStatus,
        allowNull: false
    },
    notification: {
        type: DataTypes.STRING,
        defaultValue: antideleteNotification,
        allowNull: false
    },
    includeGroupInfo: {
        type: DataTypes.BOOLEAN,
        defaultValue: antideleteIncludeGroupInfo,
        allowNull: false
    },
    sendToOwner: {
        type: DataTypes.BOOLEAN,
        defaultValue: antideleteSendToOwner,
        allowNull: false
    },
    includeMedia: {
        type: DataTypes.BOOLEAN,
        defaultValue: antideleteIncludeMedia,
        allowNull: false
    }
}, {
    timestamps: true
});

async function initAntiDeleteDB() {
    try {
        await AntiDeleteDB.sync({ alter: true });
        console.log('AntiDelete table ready');
        
        // Initialize with default values if empty
        const count = await AntiDeleteDB.count();
        if (count === 0) {
            await AntiDeleteDB.create({
                status: antideleteStatus,
                notification: antideleteNotification,
                includeGroupInfo: antideleteIncludeGroupInfo,
                sendToOwner: antideleteSendToOwner,
                includeMedia: antideleteIncludeMedia
            });
            console.log('AntiDelete defaults initialized from settings');
        }
    } catch (error) {
        console.error('Error initializing AntiDelete table:', error);
        throw error;
    }
}

async function getAntiDeleteSettings() {
    try {
        const settings = await AntiDeleteDB.findOne();
        if (!settings) {
            return await AntiDeleteDB.create({
                status: antideleteStatus,
                notification: antideleteNotification,
                includeGroupInfo: antideleteIncludeGroupInfo,
                sendToOwner: antideleteSendToOwner,
                includeMedia: antideleteIncludeMedia
            });
        }
        return settings;
    } catch (error) {
        console.error('Error getting anti-delete settings:', error);
        return { 
            status: antideleteStatus, 
            notification: antideleteNotification,
            includeGroupInfo: antideleteIncludeGroupInfo,
            sendToOwner: antideleteSendToOwner,
            includeMedia: antideleteIncludeMedia
        };
    }
}

async function updateAntiDeleteSettings(updates) {
    try {
        const settings = await getAntiDeleteSettings();
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating anti-delete settings:', error);
        return null;
    }
}

module.exports = {
    initAntiDeleteDB,
    getAntiDeleteSettings,
    updateAntiDeleteSettings,
    AntiDeleteDB
};

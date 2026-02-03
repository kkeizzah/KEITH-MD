const { DataTypes } = require('sequelize');
const { 
  database, 
  groupeventsEnabled, 
  groupeventsWelcomeMessage, 
  groupeventsGoodbyeMessage, 
  groupeventsShowPromotions 
} = require('../settings');

const GroupEventsDB = database.define('groupevents', {
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: groupeventsEnabled,
        allowNull: false
    },
    welcomeMessage: {
        type: DataTypes.TEXT,
        defaultValue: groupeventsWelcomeMessage,
        allowNull: false
    },
    goodbyeMessage: {
        type: DataTypes.TEXT,
        defaultValue: groupeventsGoodbyeMessage,
        allowNull: false
    },
    showPromotions: {
        type: DataTypes.BOOLEAN,
        defaultValue: groupeventsShowPromotions,
        allowNull: false
    }
}, {
    timestamps: true
});

async function initGroupEventsDB() {
    try {
        await GroupEventsDB.sync({ alter: true });
        console.log('GroupEvents table ready');
        
        // Initialize with default values if empty
        const count = await GroupEventsDB.count();
        if (count === 0) {
            await GroupEventsDB.create({
                enabled: groupeventsEnabled,
                welcomeMessage: groupeventsWelcomeMessage,
                goodbyeMessage: groupeventsGoodbyeMessage,
                showPromotions: groupeventsShowPromotions
            });
            console.log('GroupEvents defaults initialized from settings');
        }
    } catch (error) {
        console.error('Error initializing GroupEvents table:', error);
        throw error;
    }
}

async function getGroupEventsSettings() {
    try {
        const settings = await GroupEventsDB.findOne();
        if (!settings) {
            return await GroupEventsDB.create({
                enabled: groupeventsEnabled,
                welcomeMessage: groupeventsWelcomeMessage,
                goodbyeMessage: groupeventsGoodbyeMessage,
                showPromotions: groupeventsShowPromotions
            });
        }
        return settings;
    } catch (error) {
        console.error('Error getting group events settings:', error);
        return { 
            enabled: groupeventsEnabled,
            welcomeMessage: groupeventsWelcomeMessage,
            goodbyeMessage: groupeventsGoodbyeMessage,
            showPromotions: groupeventsShowPromotions
        };
    }
}

async function updateGroupEventsSettings(updates) {
    try {
        const settings = await getGroupEventsSettings();
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating group events settings:', error);
        return null;
    }
}

module.exports = {
    initGroupEventsDB,
    getGroupEventsSettings,
    updateGroupEventsSettings,
    GroupEventsDB
};

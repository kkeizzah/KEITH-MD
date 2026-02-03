const { DataTypes } = require('sequelize');
const { database, greetEnabled, greetMessage } = require('../settings');

const GreetDB = database.define('greet', {
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: greetEnabled,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        defaultValue: greetMessage,
        allowNull: false
    }
}, {
    timestamps: true
});

// Store replied contacts in memory
const repliedContacts = new Set();

async function initGreetDB() {
    try {
        await GreetDB.sync({ alter: true });
        console.log('Greet table ready');
        
        // Initialize with default values if empty
        const count = await GreetDB.count();
        if (count === 0) {
            await GreetDB.create({
                enabled: greetEnabled,
                message: greetMessage
            });
            console.log('Greet defaults initialized from settings');
        }
    } catch (error) {
        console.error('Error initializing Greet table:', error);
        throw error;
    }
}

async function getGreetSettings() {
    try {
        const settings = await GreetDB.findOne();
        if (!settings) {
            return await GreetDB.create({
                enabled: greetEnabled,
                message: greetMessage
            });
        }
        return settings;
    } catch (error) {
        console.error('Error getting greet settings:', error);
        return { 
            enabled: greetEnabled,
            message: greetMessage
        };
    }
}

async function updateGreetSettings(updates) {
    try {
        const settings = await getGreetSettings();
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating greet settings:', error);
        return null;
    }
}

function clearRepliedContacts() {
    repliedContacts.clear();
}

module.exports = {
    initGreetDB,
    getGreetSettings,
    updateGreetSettings,
    clearRepliedContacts,
    repliedContacts,
    GreetDB
};

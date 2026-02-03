const { DataTypes } = require('sequelize');
const { database, anticallStatus, anticallMessage, anticallAction } = require('../settings');

const AntiCallDB = database.define('anticall', {
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: anticallStatus,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        defaultValue: anticallMessage,
        allowNull: false
    },
    action: {
        type: DataTypes.ENUM('reject', 'block'),
        defaultValue: anticallAction,
        allowNull: false
    }
}, {
    timestamps: true
});

async function initAntiCallDB() {
    try {
        await AntiCallDB.sync({ alter: true });
        console.log('AntiCall table ready');
        
        // Initialize with default values if empty
        const count = await AntiCallDB.count();
        if (count === 0) {
            await AntiCallDB.create({
                status: anticallStatus,
                message: anticallMessage,
                action: anticallAction
            });
            console.log('AntiCall defaults initialized from settings');
        }
    } catch (error) {
        console.error('Error initializing AntiCall table:', error);
        throw error;
    }
}

async function getAntiCallSettings() {
    try {
        const settings = await AntiCallDB.findOne();
        if (!settings) {
            // Create with environment defaults
            return await AntiCallDB.create({
                status: anticallStatus,
                message: anticallMessage,
                action: anticallAction
            });
        }
        return settings;
    } catch (error) {
        console.error('Error getting anti-call settings:', error);
        // Return environment defaults as fallback
        return { 
            status: anticallStatus, 
            message: anticallMessage, 
            action: anticallAction 
        };
    }
}

async function updateAntiCallSettings(updates) {
    try {
        const settings = await getAntiCallSettings();
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating anti-call settings:', error);
        return null;
    }
}

module.exports = {
    initAntiCallDB,
    getAntiCallSettings,
    updateAntiCallSettings,
    AntiCallDB
};

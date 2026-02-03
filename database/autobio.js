const { DataTypes } = require('sequelize');
const { database, autobioStatus, autobioMessage } = require('../settings');

const AutoBioDB = database.define('autobio', {
    status: {
        type: DataTypes.ENUM('on', 'off'),
        defaultValue: autobioStatus,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        defaultValue: autobioMessage,
        allowNull: false
    }
}, {
    timestamps: true
});

async function initAutoBioDB() {
    try {
        await AutoBioDB.sync({ alter: true });
        console.log('AutoBio table ready');
        
        // Initialize with default values if empty
        const count = await AutoBioDB.count();
        if (count === 0) {
            await AutoBioDB.create({
                status: autobioStatus,
                message: autobioMessage
            });
            console.log('AutoBio defaults initialized from settings');
        }
    } catch (error) {
        console.error('Error initializing AutoBio table:', error);
        throw error;
    }
}

async function getAutoBioSettings() {
    try {
        const [settings] = await AutoBioDB.findOrCreate({
            where: {},
            defaults: {
                status: autobioStatus,
                message: autobioMessage
            }
        });
        return settings;
    } catch (error) {
        console.error('Error getting AutoBio settings:', error);
        return { 
            status: autobioStatus, 
            message: autobioMessage 
        };
    }
}

async function updateAutoBioSettings(updates) {
    try {
        const settings = await getAutoBioSettings();
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating AutoBio settings:', error);
        return null;
    }
}

module.exports = {
    initAutoBioDB,
    getAutoBioSettings,
    updateAutoBioSettings,
    AutoBioDB
};

const { DataTypes } = require('sequelize');
const { database, antistatusmentionStatus, antistatusmentionAction, antistatusmentionWarnLimit } = require('../settings');

const AntiStatusMentionDB = database.define('antistatusmention', {
    status: {
        type: DataTypes.ENUM('off', 'warn', 'delete', 'remove'),
        defaultValue: antistatusmentionStatus,
        allowNull: false
    },
    action: {
        type: DataTypes.ENUM('warn', 'delete', 'remove'),
        defaultValue: antistatusmentionAction,
        allowNull: false
    },
    warn_limit: {
        type: DataTypes.INTEGER,
        defaultValue: antistatusmentionWarnLimit,
        allowNull: false
    }
}, {
    timestamps: true
});

// Store warn counts in memory
const statusWarnCounts = new Map();

async function initAntiStatusMentionDB() {
    try {
        await AntiStatusMentionDB.sync({ alter: true });
        console.log('AntiStatusMention table ready');
        
        // Initialize with default values if empty
        const count = await AntiStatusMentionDB.count();
        if (count === 0) {
            await AntiStatusMentionDB.create({
                status: antistatusmentionStatus,
                action: antistatusmentionAction,
                warn_limit: antistatusmentionWarnLimit
            });
            console.log('AntiStatusMention defaults initialized from settings');
        }
    } catch (error) {
        console.error('Error initializing AntiStatusMention table:', error);
        throw error;
    }
}

async function getAntiStatusMentionSettings() {
    try {
        const [settings] = await AntiStatusMentionDB.findOrCreate({
            where: {},
            defaults: {
                status: antistatusmentionStatus,
                action: antistatusmentionAction,
                warn_limit: antistatusmentionWarnLimit
            }
        });
        return settings;
    } catch (error) {
        console.error('Error getting anti-status-mention settings:', error);
        return { 
            status: antistatusmentionStatus, 
            action: antistatusmentionAction, 
            warn_limit: antistatusmentionWarnLimit
        };
    }
}

async function updateAntiStatusMentionSettings(updates) {
    try {
        const settings = await getAntiStatusMentionSettings();
        return await settings.update(updates);
    } catch (error) {
        console.error('Error updating anti-status-mention settings:', error);
        return null;
    }
}

function getStatusWarnCount(userJid) {
    return statusWarnCounts.get(userJid) || 0;
}

function incrementStatusWarnCount(userJid) {
    const current = getStatusWarnCount(userJid);
    statusWarnCounts.set(userJid, current + 1);
    return current + 1;
}

function resetStatusWarnCount(userJid) {
    statusWarnCounts.delete(userJid);
}

function clearAllStatusWarns() {
    statusWarnCounts.clear();
}

module.exports = {
    initAntiStatusMentionDB,
    getAntiStatusMentionSettings,
    updateAntiStatusMentionSettings,
    getStatusWarnCount,
    incrementStatusWarnCount,
    resetStatusWarnCount,
    clearAllStatusWarns,
    AntiStatusMentionDB
};

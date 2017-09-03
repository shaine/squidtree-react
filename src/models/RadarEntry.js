import mongoose from 'mongoose';

const RINGS = [
    'adopt',
    'trial',
    'assess',
    'hold'
];

const QUADRANTS = [
    'tools',
    'languages & frameworks',
    'platforms',
    'techniques'
];

const radarEntrySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quadrant: {
        type: String,
        enum: QUADRANTS,
        required: true
    },
    ring: {
        type: String,
        enum: RINGS,
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

const RadarEntry = mongoose.model('RadarEntry', radarEntrySchema);
exports.RadarEntry = RadarEntry;

exports.createRadarEntry = function createRadarEntry({
    name,
    ring,
    quadrant,
    description
}, cb) {
    const radarEntryInfo = {
        name,
        ring,
        quadrant,
        description
    };

    const radarEntry = new RadarEntry(radarEntryInfo);
    radarEntry.save(cb);
};

exports.getRadarEntriesForDates = function getRadarEntriesForDates(startDateString, endDateString, cb) {
    const createdAt = {};

    if (startDateString) {
        createdAt.$gte = new Date(startDateString);
    }

    if (endDateString) {
        createdAt.$lt = new Date(endDateString);
    }

    RadarEntry.find({
        createdAt
    }, null, { sort: { createdAt: -1 } }, cb);
};

const mongoose = require('mongoose');

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
    rings: {
        type: String,
        enum: RINGS,
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

const RadarEntry = mongoose.model('RadarEntry', radarEntrySchema);

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

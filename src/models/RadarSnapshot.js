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

const radarSnapshotSchema = mongoose.Schema({
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

const RadarSnapshot = mongoose.model('RadarSnapshot', radarSnapshotSchema);

exports.createRadarSnapshot = function createRadarSnapshot(cb) {
    const radarSnapshotInfo = {};

    const radarSnapshot = new RadarSnapshot(radarSnapshotInfo);
    radarSnapshot.save(cb);
};

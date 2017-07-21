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
    createdAt: { type: Date, default: Date.now }
});

const RadarSnapshot = mongoose.model('RadarSnapshot', radarSnapshotSchema);

exports.createRadarSnapshot = function createRadarSnapshot(cb) {
    const radarSnapshotInfo = {};

    const radarSnapshot = new RadarSnapshot(radarSnapshotInfo);
    radarSnapshot.save(cb);
};

exports.getAllRadarSnapshots = function getAllRadarSnapshots(cb) {
    RadarSnapshot.find({}, null, {
        sort: {
            createdAt: -1
        }
    }, cb);
};

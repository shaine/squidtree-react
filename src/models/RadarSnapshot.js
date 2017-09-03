import mongoose from 'mongoose';

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

exports.getCurrentAndPreviousRadarSnapshotsForMonth =
function getCurrentAndPreviousRadarSnapshotsForMonth(monthString, cb) {
    // Locate the snapshot anywhere within the month
    // Beginning of the month
    const startDate = new Date(monthString);
    const endDate = new Date(monthString);
    // Jump to end of month
    endDate.setMonth(endDate.getMonth() + 1);
    // Jump to end of day
    endDate.setDate(endDate.getDate() + 1);

    RadarSnapshot.find({
        createdAt: {
            $lt: endDate
        }
    }, null, {
        sort: {
            createdAt: -1
        },
        limit: 2
    }, (error, results) => {
        if (error) {
            cb(error, null);
        } else if (!results || !results.length || results[0].createdAt < startDate) {
            // Error on no results, or the first result isn't in the current month
            // (i.e. the supplied date didn't match a specific snapshot)
            cb(new Error(`No radar snapshot found for month ${monthString}`), null);
        } else {
            cb(null, results);
        }
    });
};

exports.getLastRadarSnapshot = function getLastRadarSnapshot(cb) {
    RadarSnapshot.findOne({}, null, {
        sort: {
            createdAt: -1
        }
    }, cb);
};

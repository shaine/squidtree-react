import { describe, it } from 'mocha';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';

const { expect } = chai;
chai.use(sinonChai);

const RadarSnapshotStub = sinon.stub();
RadarSnapshotStub.find = sinon.stub();
RadarSnapshotStub.findOne = sinon.stub();
RadarSnapshotStub.prototype.save = sinon.stub();
const mongooseStub = {
    Schema: sinon.stub().returns('foo schema'),
    model: sinon.stub().withArgs('RadarSnapshot', 'foo schema').returns(RadarSnapshotStub)
};
mongooseStub.Schema.Types = {
    ObjectId: 'ObjectId'
};
const {
    createRadarSnapshot,
    getAllRadarSnapshots,
    getCurrentAndPreviousRadarSnapshotsForMonth,
    getLastRadarSnapshot
} = proxyquire('./RadarSnapshot', {
    mongoose: mongooseStub
});

describe('RadarSnapshot', () => {
    beforeEach(() => {
        RadarSnapshotStub.reset();
    });

    describe('createRadarSnapshot', () => {
        it('instantiates, saves, and returns a new radar snapshot', () => {
            // Set up
            const cbStub = sinon.stub();

            // Run unit
            createRadarSnapshot(cbStub);

            // Verify expectations
            expect(RadarSnapshotStub.prototype.save)
                .to.have.been.calledWith(cbStub);
            expect(RadarSnapshotStub)
                .to.have.been.called;
        });
    });

    describe('getAllRadarSnapshots', () => {
        it('returns all radar snapshots', () => {
            // Set up
            const cbStub = sinon.stub();

            // Run unit
            getAllRadarSnapshots(cbStub);

            // Verify expectations
            expect(RadarSnapshotStub.find)
                .to.have.been.calledWith({}, null, {
                    sort: {
                        createdAt: -1
                    }
                }, cbStub);
        });
    });

    describe('getCurrentAndPreviousRadarSnapshotsForMonth', () => {
        beforeEach(() => {
            RadarSnapshotStub.find.reset();
        });

        it('returns a radar snapshot for a month', done => {
            // Set up
            RadarSnapshotStub.find
                .callsArgWith(3, null, ['result1', 'resul2']);

            // Run unit
            getCurrentAndPreviousRadarSnapshotsForMonth('2017-07', (error, results) => {
                // Verify expectations
                expect(RadarSnapshotStub.find)
                    .to.have.been.calledWith({
                        createdAt: {
                            $lt: new Date('2017-08')
                        }
                    }, null, {
                        sort: {
                            createdAt: -1
                        },
                        limit: 2
                    });
                expect(error).to.be.null;
                expect(results)
                    .to.eql(['result1', 'resul2']);

                done();
            });
        });

        it('returns an error if no snapshot found for the month', done => {
            // Set up
            RadarSnapshotStub.find
                .callsArgWith(3, null, [{
                    createdAt: new Date('2016-03')
                }]);

            // Run unit
            getCurrentAndPreviousRadarSnapshotsForMonth('2017-07', (error, results) => {
                // Verify expectations
                expect(RadarSnapshotStub.find)
                    .to.have.been.calledWith({
                        createdAt: {
                            $lt: new Date('2017-08')
                        }
                    }, null, {
                        sort: {
                            createdAt: -1
                        },
                        limit: 2
                    });
                expect(results).to.be.null;
                expect(error)
                    .to.be.an.instanceOf(Error);
                expect(error.message)
                    .to.equal('No radar snapshot found for month 2017-07');

                done();
            });
        });
    });

    describe('getLastRadarSnapshot', () => {
        beforeEach(() => {
            RadarSnapshotStub.findOne.reset();
        });

        it('queries for the last radar snapshot', () => {
            // Set up
            const cbStub = sinon.stub();

            // Run unit
            getLastRadarSnapshot(cbStub);

            // Verify expectations
            expect(RadarSnapshotStub.findOne)
                .to.have.been.calledWith({}, null, {
                    sort: {
                        createdAt: -1
                    }
                }, cbStub);
        });
    });
});

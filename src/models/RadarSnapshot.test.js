import { describe, it } from 'mocha';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';

const { expect } = chai;
chai.use(sinonChai);

const RadarSnapshotStub = sinon.stub();
RadarSnapshotStub.find = sinon.stub();
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
    getAllRadarSnapshots
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
});

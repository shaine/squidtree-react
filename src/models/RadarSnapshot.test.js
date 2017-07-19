const { describe, it } = require('mocha');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');

const { expect } = chai;
chai.use(sinonChai);

const RadarSnapshotStub = sinon.stub();
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
    createRadarSnapshot
} = proxyquire('./RadarSnapshot', {
    mongoose: mongooseStub
});

describe('RadarSnapshot', () => {
    describe('createRadarSnapshot', () => {
        it('instantiates, saves, and returns a new radar snapshot', () => {
            // Set up
            const cbStub = sinon.stub();

            // Run unit
            createRadarSnapshot(cbStub);

            expect(RadarSnapshotStub.prototype.save)
                .to.have.been.calledWith(cbStub);
            expect(RadarSnapshotStub)
                .to.have.been.called;

            // Tear down
            RadarSnapshotStub.reset();
        });
    });

    describe('getRadarEntriesForDate', () => {
        it('returns radar entries since the last radar snapshot');

        it('returns all radar entries before the first radar snapshot');

        it('returns all radar entries after the last radar snapshot if no date');

        it('returns an error if date does not match a radar snapshot');
    });
});

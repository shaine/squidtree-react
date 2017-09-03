import { describe, it } from 'mocha';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';

const { expect } = chai;
chai.use(sinonChai);

const RadarEntryStub = sinon.stub();
RadarEntryStub.find = sinon.stub();
RadarEntryStub.prototype.save = sinon.stub();
const mongooseStub = {
    Schema: sinon.stub().returns('foo schema'),
    model: sinon.stub().withArgs('RadarEntry', 'foo schema').returns(RadarEntryStub)
};
mongooseStub.Schema.Types = {
    ObjectId: 'ObjectId'
};
const {
    createRadarEntry,
    getRadarEntriesForDates
} = proxyquire('./RadarEntry', {
    mongoose: mongooseStub
});

describe('RadarEntry', () => {
    describe('createRadarEntry', () => {
        it('instantiates, saves, and returns a new radar entry', () => {
            // Set up
            const cbStub = sinon.stub();

            // Run unit
            createRadarEntry({
                name: 'Foo',
                description: 'bar',
                quadrant: 'tools',
                ring: 'adopt'
            }, cbStub);

            expect(RadarEntryStub.prototype.save)
                .to.have.been.calledWith(cbStub);
            expect(RadarEntryStub)
                .to.have.been.calledWith({
                    name: 'Foo',
                    description: 'bar',
                    quadrant: 'tools',
                    ring: 'adopt'
                });

            // Tear down
            RadarEntryStub.reset();
        });
    });

    describe('getRadarEntriesForDates', () => {
        beforeEach(() => {
            RadarEntryStub.find.reset();
        });

        it('returns radar entries between the dates', () => {
            // Run unit
            getRadarEntriesForDates('2017-04-19', '2017-04-21', 'callback');

            // Verify expectations
            expect(RadarEntryStub.find).to.have.been.calledWith({
                createdAt: {
                    $gte: new Date('2017-04-19'),
                    $lt: new Date('2017-04-21')
                }
            }, null, { sort: { createdAt: -1 } }, 'callback');
        });

        it('returns all radar entries before the end date if no start date', () => {
            // Run unit
            getRadarEntriesForDates(null, '2017-04-21', 'callback');

            // Verify expectations
            expect(RadarEntryStub.find).to.have.been.calledWith({
                createdAt: {
                    $lt: new Date('2017-04-21')
                }
            }, null, { sort: { createdAt: -1 } }, 'callback');
        });

        it('returns all radar entries after the start date if no end date', () => {
            // Run unit
            getRadarEntriesForDates('2017-04-21', null, 'callback');

            // Verify expectations
            expect(RadarEntryStub.find).to.have.been.calledWith({
                createdAt: {
                    $gte: new Date('2017-04-21')
                }
            }, null, { sort: { createdAt: -1 } }, 'callback');
        });
    });
});

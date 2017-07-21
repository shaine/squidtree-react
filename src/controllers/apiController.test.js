import { describe, it } from 'mocha';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import apiController from './apiController';

const { expect } = chai;
chai.use(sinonChai);

describe('apiController', () => {
    it('calls next if the content-type and accepts are JSON', () => {
        // Set up
        const req = {
            headers: {
                accepts: 'application/json',
                'content-type': 'application/json'
            }
        };
        const res = {
            json: sinon.stub().returnsThis(),
            status: sinon.stub().returnsThis(),
            send: sinon.stub().returnsThis()
        };
        const next = sinon.stub();

        // Run unit
        apiController(req, res, next);

        // Verify expectations
        expect(next)
            .to.have.been.called;
    });

    it('returns 415 if content-type is not JSON', () => {
        // Set up
        const req = {
            headers: {
                accepts: 'application/json',
                'content-type': 'application/text'
            }
        };
        const res = {
            json: sinon.stub().returnsThis(),
            status: sinon.stub().returnsThis(),
            send: sinon.stub().returnsThis()
        };
        const next = sinon.stub();

        // Run unit
        apiController(req, res, next);

        // Verify expectations
        expect(res.status)
            .to.have.been.calledWith(415);
        expect(res.json)
            .to.have.been.calledWith({
                error: 'Unsupported Media Type'
            });
        expect(next)
            .to.not.have.been.called;
    });

    it('returns 415 if accepts is not JSON', () => {
        // Set up
        const req = {
            headers: {
                accepts: 'application/text',
                'content-type': 'application/json'
            }
        };
        const res = {
            json: sinon.stub().returnsThis(),
            status: sinon.stub().returnsThis(),
            send: sinon.stub().returnsThis()
        };
        const next = sinon.stub();

        // Run unit
        apiController(req, res, next);

        // Verify expectations
        expect(res.status)
            .to.have.been.calledWith(415);
        expect(res.send)
            .to.have.been.calledWith('Unsupported Media Type');
        expect(next)
            .to.not.have.been.called;
    });
});

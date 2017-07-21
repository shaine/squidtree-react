import { describe, it } from 'mocha';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import logoutController from './logoutController';

const { expect } = chai;
chai.use(sinonChai);

describe('logoutController', () => {
    it('removes the user from the session', () => {
        // Set up
        const req = {
            session: {
                destroy: sinon.stub().yields()
            }
        };
        const res = {
            sendStatus: sinon.stub().returnsThis()
        };

        // Run unit
        logoutController(req, res);

        // Verify expectations
        expect(req.session.destroy)
            .to.have.been.called;
        expect(res.sendStatus)
            .to.have.been.calledWith(204);
    });
});

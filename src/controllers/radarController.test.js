import { describe, it } from 'mocha';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { noCallThru } from 'proxyquire';

const { expect } = chai;
chai.use(sinonChai);
const proxyquire = noCallThru();

const userStub = {
    getUserByEmailAndPassword: sinon.stub()
};
userStub.getUserByEmailAndPassword
    .withArgs('', '').yields(null, null)
    .withArgs('abc', '123').yields(null, 'foo user');
const loginController = proxyquire('./loginController', {
    '../models/User': userStub
});

describe('loginController', () => {
    it('sets the user for a session and returns info', () => {
        // Set up
        const req = {
            session: {},
            body: {
                email: 'abc',
                password: '123'
            }
        };
        const res = {
            json: sinon.stub().returnsThis(),
            status: sinon.stub().returnsThis()
        };

        // Run unit
        loginController(req, res);

        // Verify expectations
        expect(req.session.user)
            .to.equal('foo user');
        expect(res.json)
            .to.have.been.calledWith({
                message: 'Successfully logged in',
                user: 'foo user'
            });
        expect(res.status)
            .to.have.been.calledWith(200);
    });

    it('does not set the user for a session and returns failure', () => {
        // Set up
        const req = {
            session: {},
            body: {}
        };
        const res = {
            json: sinon.stub().returnsThis(),
            status: sinon.stub().returnsThis()
        };

        // Run unit
        loginController(req, res);

        // Verify expectations
        expect(req.session.user)
            .to.be.null;
        expect(res.json)
            .to.have.been.calledWith({
                message: 'Invalid email or password'
            });
        expect(res.status)
            .to.have.been.calledWith(401);
    });
});

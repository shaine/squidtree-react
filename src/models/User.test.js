const { describe, it } = require('mocha');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');

const { expect } = chai;
chai.use(sinonChai);

const UserStub = sinon.stub();
UserStub.findOne = sinon.stub();
UserStub.prototype.save = sinon.stub();
const mongooseStub = {
    Schema: sinon.stub().returns('foo schema'),
    model: sinon.stub().withArgs('User', 'foo schema').returns(UserStub)
};
const passwordStub = {
    verifyPassword: sinon.stub(),
    hashPassword: sinon.stub()
};
const {
    getUserByEmailAndPassword,
    createUser
} = proxyquire('./User', {
    mongoose: mongooseStub,
    '../helpers/password': passwordStub
});

describe('User', () => {
    describe('getUserByEmailAndPassword', () => {
        afterEach(() => {
            UserStub.findOne.reset();
            passwordStub.verifyPassword.reset();
        });

        it('returns a find error', done => {
            // Set up
            UserStub.findOne
                .withArgs({
                    email: 'foo@test.com'
                }, 'name email passwordHash')
                .callsArgWith(2, 'foo error');

            // Run unit
            getUserByEmailAndPassword('foo@test.com', '123', (error, user) => {
                // Verify expectations
                expect(error)
                    .to.equal('foo error');
                expect(user)
                    .to.be.undefined;
                done();
            });
        });

        it('returns a matching user', done => {
            // Set up
            const user = {
                passwordHash: 'hash 123',
                foo: 'bar'
            };
            UserStub.findOne
                .withArgs({
                    email: 'foo@test.com'
                }, 'name email passwordHash')
                .callsArgWith(2, null, user);
            passwordStub.verifyPassword.withArgs('123', 'hash 123')
                .returns(true);

            // Run unit
            getUserByEmailAndPassword('foo@test.com', '123', (error, user) => {
                // Verify expectations
                expect(error)
                    .to.be.null;
                expect(user)
                    .to.eql({
                        foo: 'bar'
                    });
                done();
            });
        });

        it('returns a not found error if no matches', done => {
            // Set up
            const user = {
                passwordHash: 'hash 098',
                foo: 'bar'
            };
            UserStub.findOne
                .withArgs({
                    email: 'foo@test.com'
                }, 'name email passwordHash')
                .callsArgWith(2, null, user);
            passwordStub.verifyPassword.withArgs('123', 'hash 098')
                .returns(false);

            // Run unit
            getUserByEmailAndPassword('foo@test.com', '123', (error, user) => {
                // Verify expectations
                expect(error)
                    .to.be.be.a('error');
                expect(error.message)
                    .to.equal('Email or password not valid');
                expect(user)
                    .to.be.undefined;
                done();
            });
        });
    });

    describe('createUser', () => {
        it('instantiates, saves, and returns a new user', () => {
            // Set up
            passwordStub.hashPassword.withArgs('123').returns('hash 123');
            const cbStub = sinon.stub();

            // Run unit
            createUser({
                name: 'foo',
                email: 'bar@test.com',
                password: '123'
            }, cbStub);

            expect(UserStub.prototype.save)
                .to.have.been.calledWith(cbStub);
            expect(UserStub)
                .to.have.been.calledWith({
                    name: 'foo',
                    email: 'bar@test.com',
                    passwordHash: 'hash 123'
                });

            // Tear down
            passwordStub.hashPassword.reset();
            UserStub.reset();
        });
    });
});

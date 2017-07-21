import { describe, it } from 'mocha';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';

const { expect } = chai;
chai.use(sinonChai);

const PostStub = sinon.stub();
PostStub.findOne = sinon.stub();
PostStub.prototype.save = sinon.stub();
const mongooseStub = {
    Schema: sinon.stub().returns('foo schema'),
    model: sinon.stub().withArgs('Post', 'foo schema').returns(PostStub)
};
mongooseStub.Schema.Types = {
    ObjectId: 'ObjectId'
};
const {
    createPost
} = proxyquire('./Post', {
    mongoose: mongooseStub
});

describe('Post', () => {
    describe('createPost', () => {
        it('instantiates, saves, and returns a new post', () => {
            // Set up
            const cbStub = sinon.stub();

            // Run unit
            createPost({
                title: 'foo',
                content: 'bar',
                user: {
                    _id: 123
                }
            }, cbStub);

            expect(PostStub.prototype.save)
                .to.have.been.calledWith(cbStub);
            expect(PostStub)
                .to.have.been.calledWith({
                    title: 'foo',
                    content: 'bar',
                    authorId: 123
                });

            // Tear down
            PostStub.reset();
        });
    });
});

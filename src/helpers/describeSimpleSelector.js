import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import _isUndefined from 'lodash/isUndefined';
import _set from 'lodash/set';

/**
 * Helper that tests simple selectors and optionally their default values to help
 * reduce the amount of boilerplate test code in the unit test suite
 *
 * A simple selector is one which takes an attribute from an object
 *
 * @param {string} selectorName Name of the unit being tested
 * @param {function} selector Unit being tested
 * @param {string} nodeName Name of property to pull out of substate object
 * @param {*} [defaultValue] A non-undefined value the selector short circuits to if
 * the node is not found on the substate object
 */
export default function describeSimpleSelector(selectorName, selector, nodeName, defaultValue) {
    describe(selectorName, () => {
        before(() => {
            if (_isUndefined(selector)) {
                throw new Error(`${selectorName} is undefined! Is it missing as a module index export?`);
            }
        });

        it('selects its node from the state tree', () => {
            const value = Symbol('foobar'); // Disallow SUT workarounds
            const state = {};
            _set(state, nodeName, value);
            deepFreeze(state);

            expect(selector.resultFunc(state)).to.equal(value);
        });

        if (!_isUndefined(defaultValue)) {
            let defaultValueName = defaultValue.toString();
            if (typeof defaultValue === 'string') {
                defaultValueName = `"${defaultValueName}"`;
            }

            it(`gets a default value of ${defaultValueName} if node not found`, () => {
                expect(selector.resultFunc({}))
                    .to.eql(defaultValue);
            });
        }
    });
}

import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

/**
 * Tests that the given reducer returns the same exact object, without modification,
 * when the state is queried in a way that does not cause a change in the state
 * data. The state is frozen to test for modification, and the action is sent
 * into the reducer with the new states multiple times to ensure the "new" state
 * is the same as the old state, and the returned state object matches the same
 * identity.
 *
 * Note: This test is only for reducers + actions that can create a state that
 * contains all the same values as the old state. A reducer + action that always
 * increments a number in the state, for example, would not use this test as
 * the unit always intends to create a new state object.
 *
 * @example
 * // Test default action returns the oldState
 * itReturnsTheSameStateIdentityWhenNoStateChange(productReducer);
 * @example
 * // Test the PRODUCT_LOAD_SUCCESS action returns the oldState
 * itReturnsTheSameStateIdentityWhenNoStateChange(
 *     productReducer,
 *     PRODUCT_LOAD_SUCCESS
 * );
 *
 * @param {function} reducer The reducer function being tested
 * @param {object} [action={type: 'test/UNHANDLED_ACTION'}] The action for which
 * the reducer is expected to maintain identity. If not provided, an unhandlable
 * action will be used to test the reducer's default case.
 * @param {object} [state={}] The old state to use to use with the reducer and
 * action. If not provided, the reducer's default state will be used. This param
 * has no known use cases currently.
 * @param {any} [params=[]] Any additional params to pass into the reducer as
 * additional arguments.
 */
module.exports = function itReturnsTheSameStateIdentityWhenNoStateChange(reducer, action, state, ...args) {
    // If no action is provided, create an action to trigger the default case
    const unhandledActionType = 'test/UNHANDLED_ACTION';
    action = action || { // eslint-disable-line no-param-reassign
        // Symbol creates an unhandleable type
        type: unhandledActionType
    };

    it(`returns the same state identity when no change for action ${action.type}`, () => {
        // Set up
        // If no state was provided, use an empty object. Deep freeze the state
        // to test for mutations
        const preState = deepFreeze(state || {});
        // Run the reducer once to get the "initial" state. This is what we'll
        // use to compare to the final state to see if the reducer reused the
        // state when no changes occur. Obviously deep freeze this too
        const oldState = reducer(preState, action, ...args);
        deepFreeze(oldState);

        // Run unit
        // Call the reducer in the same way a second time, but this time use
        // the state the reducer created on our first call
        const newState = reducer(oldState, action, ...args);

        // Verify expectations
        // Assert that the identity of the old objects are the same. Because
        // the oldState was created using the same action as the newState,
        // nothing needed to change
        expect(newState)
            .to.equal(oldState);
    });
};

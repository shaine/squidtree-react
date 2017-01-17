/* eslint global-require:0 */
import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import reduxThunk from 'redux-thunk';
import reduxCatch from 'redux-catch';
import reducer from 'App/reducer';

function middlewareHandler(error) {
    console.log(error);
}

export default function createStore(history, data) {
    // Sync dispatched route actions to the history
    const reduxRouterMiddleware = routerMiddleware(history);

    const middleware = [
        reduxCatch(middlewareHandler),
        reduxThunk,
        reduxRouterMiddleware
    ];

    let finalCreateStore;
    if (__CLIENT__ && window.devToolsExtension) {
        finalCreateStore = compose(
            applyMiddleware(...middleware),
            // The devtools extension is injecting this function into the document
            // so we can call it. It returns a middleware definition that allows
            // it to hook into events right before they enter the root reducer
            window.devToolsExtension()
        )(_createStore);
    } else {
        finalCreateStore = applyMiddleware(...middleware)(_createStore);
    }

    const store = finalCreateStore(reducer, data);

    if (__DEVELOPMENT__ && module.hot) {
        module.hot.accept('App/reducer', () => {
            store.replaceReducer(require('App/reducer').default);
        });
    }

    return store;
}

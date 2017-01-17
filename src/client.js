import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, applyRouterMiddleware, browserHistory } from 'react-router';
import createStore from 'store/createStore';
import { syncHistoryWithStore } from 'react-router-redux';
import { useRedial } from 'react-router-redial';
import useScroll from 'react-router-scroll/lib/useScroll';
import getRoutes from 'routes';
/*
import {
    completeAppLoading,
    startAppLoading
} from 'App';
*/

function handleError(error) {
    console.log(error);
}

try {
    const dest = document.getElementById('main-container');
    const store = createStore(browserHistory, window.__data);
    const history = syncHistoryWithStore(browserHistory, store);

    const component = (<Router
        render={applyRouterMiddleware(useScroll(), useRedial({
            locals: { store },
            parallel: false
            /*
            beforeTransition: ['fetch'],
            afterTransition: ['defer']
            onStarted: () => {
                return store.dispatch(startAppLoading());
            },
            onCompleted: () => {
                return store.dispatch(completeAppLoading());
            }
            */
        }))}
        history={history}
    >
        {getRoutes(store)}
    </Router>);

    ReactDOM.render(
        (<Provider
            store={store}
            key="provider"
        >
            {component}
        </Provider>),
        dest
    );

    if (process.env.NODE_ENV !== 'production') {
        if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
            handleError('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.', true);
        }
    }
} catch (error) {
    handleError(error, true);
}

import 'babel-polyfill';
import Express from 'express';
// Caching needs to come before React since it patches its internals
import 'electrode-react-ssr-caching'; // eslint-disable-line
import React from 'react'; // eslint-disable-line
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/server';
import compression from 'compression';
import path from 'path';
import createStore from 'store/createStore';
import http from 'http';
import { match, applyRouterMiddleware } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { triggerHooks, useRedial } from 'react-router-redial';
import createHistory from 'react-router/lib/createMemoryHistory';
import _last from 'lodash/last';
import getRoutes from 'routes';
import ConnectedHtml, { Html } from 'helpers/Html';
import ErrorPage from 'App/Error/Error';
import App from 'App/App';
import dbConnect from 'helpers/db';
import apiController from 'controllers/apiController';
import loginController from 'controllers/loginController';
import logoutController from 'controllers/logoutController';
import session from 'express-session';
import mongoSession from 'connect-mongodb-session';
import bodyParser from 'body-parser';
import { loadConfig } from 'App/Config/actions';
import config from '../config.json';
import defaultFlags from '../flags.json';
import flagOverrides from '../flag-overrides.json';

const flags = {
    ...defaultFlags,
    ...flagOverrides
};

const app = new Express();
const server = new http.Server(app);
const port = process.env.PORT || config.port;
if (!port) {
    throw new Error('No port specified! Please re-run command with a PORT env var present or a port in config.json.');
}

// Set up session
const sessionStore = new (mongoSession(session))({
    uri: config.dbUri,
    collection: 'sessions'
});
sessionStore.on('error', error => {
    console.error(error);
});
app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !__DEVELOPMENT__ },
    store: sessionStore
}));

app.use(compression());
app.use(bodyParser.json());

// Use static files
app.use('/.well-known', Express.static(path.join('.well-known'), {
    dotfiles: 'allow'
}));
app.use('/public', Express.static(path.join('public')));

app.use(['/api', '/api/*'], apiController);
if (flags['login.enabled']) {
    app.use('/api/login', loginController);
    app.use('/api/logout', logoutController);
}

app.use((req, res, next) => {
    if (__DEVELOPMENT__) {
        // Do not cache webpack stats: the script file would change since
        // hot module replacement is enabled in the development env
        webpackIsomorphicTools.refresh();
    }

    const memoryHistory = createHistory(req.originalUrl);

    const store = createStore(memoryHistory);
    const history = syncHistoryWithStore(memoryHistory, store);

    store.dispatch(loadConfig(flags));

    match({ history, routes: getRoutes(store.getState()), location: req.originalUrl }, (err, redirect, props) => {
        if (redirect) {
            res.redirect(redirect.pathname + redirect.search);
        } else if (err) {
            next(err);
        } else if (props) {
            const redialPromise = triggerHooks({
                renderProps: props,
                locals: {
                    res,
                    store
                },
                hooks: ['fetch']
            });

            redialPromise.then(({ redialMap, redialProps }) => {
                const { routes } = props;

                res.status(_last(routes).status || 200);

                const component = (<Provider store={store} key="provider">
                    {applyRouterMiddleware(useRedial({ redialMap }))(props)}
                </Provider>);

                res.send(`<!doctype html>\n${ReactDOM.renderToString(
                    <ConnectedHtml
                        assets={webpackIsomorphicTools.assets()}
                        component={component}
                        store={store}
                        redialProps={redialProps}
                    />
                )}`);
            }).catch(next);
        } else {
            next();
        }
    });
});

function renderError(req, res, statusCode, errorMessage) {
    res.status(statusCode);

    const component = (<App><ErrorPage error={errorMessage} /></App>);

    res.send(`<!doctype html>\n${ReactDOM.renderToString(
        <Html
            assets={webpackIsomorphicTools.assets()}
            component={component}
        />
    )}`);
}

app.use((req, res) => renderError(req, res, 404, 'Not Found'));

app.use((error, req, res, next) => // eslint-disable-line
    console.error(error) || renderError(req, res, 500, 'Internal Server Error'));

dbConnect(() => {
    server.listen(port, err => {
        if (err) {
            console.error(err, true);
        }
        console.info(`==> ✅  Server is running on port ${port}.`);
    });
});

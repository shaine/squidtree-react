/* eslint-disable */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App/App';
import Home from './App/Home/Home';
import BlogList from './App/Blog/BlogList';
import BlogPost from './App/Blog/BlogPost';
import About from './App/About/About';
import Login from './App/Login/Login';
import Radar from './App/Radar/Radar';
import ErrorPage from './App/Error/Error';
import { getConfigByName } from './App/Config/entities';

export const PRIVATE_BLOG = 'PRIVATE_BLOG';
export const PUBLIC_BLOG = 'PUBLIC_BLOG';

export default state => {
    return (
        <Route path="/" component={App}>
            {/* Home */}
            {<IndexRoute component={Home} />}

            {/* Public blog */}
            {getConfigByName(state, 'blog.words.enabled') && <Route path="/words" routeType={PUBLIC_BLOG} component={BlogList} />}
            {getConfigByName(state, 'blog.words.enabled') && <Route path="/words/:slug" routeType={PUBLIC_BLOG} component={BlogPost} />}

            {/* Private blog */}
            {getConfigByName(state, 'blog.thoughts.enabled') && <Route path="/thoughts" routeType={PRIVATE_BLOG} component={BlogList} />}
            {getConfigByName(state, 'blog.thoughts.enabled') && <Route path="/thoughts/:slug" routeType={PRIVATE_BLOG} component={BlogPost} />}

            {/* About */}
            {<Route path="/about" component={About} />}

            {/* Session */}
            {getConfigByName(state, 'login.enabled') && <Route path="/login" component={Login} />}

            {/* Technology Radars */}
            {getConfigByName(state, 'radar.enabled') && <Route path="/radar(/:date)" component={Radar} />}

            {/* Errors */}
            {<Route path="*" component={ErrorPage} status={404} />}
        </Route>
    );
};

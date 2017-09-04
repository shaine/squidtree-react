import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import Logo from 'App/Header/Logo';
import { Link } from 'react-router';

const meta = {
    titleTemplate: '%s | Squidtree',
    title: 'Shaine Hatch was here',
    meta: [
        { charset: 'utf-8' },
        { property: 'og:site_name', content: 'Squidtree' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no' }
    ],
    link: [
        { rel: 'dns-prefetch', href: 'https://www.squidtree.com' }
    ]
};

const App = ({ children }) => {
    return (
        <div id="app">
            <Helmet
                {...meta}
            />

            <p>
                <Link to="/">
                    <Logo color="#d1c9df" />
                </Link>
            </p>

            {children}
        </div>
    );
};

App.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default App;

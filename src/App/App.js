import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import Logo from './Header/Logo';
import { loadWeather } from './Color/actions';
import { getCurrentColor } from './Color/entities';

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

function mapStateToProps(state) {
    return {
        color: getCurrentColor(state)
    };
}

const App = ({ children, color }) => {
    const style = `a:active, a:hover {
        color: ${color}
    }`;

    return (
        <div id="app">
            <Helmet
                {...meta}
            />

            <style dangerouslySetInnerHTML={{ __html: style }} />

            <p>
                <Link to="/">
                    <Logo color={color} />
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
    ]),
    color: PropTypes.string
};

export default provideHooks({
    fetch: ({ store: { dispatch } }) => dispatch(loadWeather())
})(connect(mapStateToProps)(App));

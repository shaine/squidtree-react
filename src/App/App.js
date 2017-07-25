import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import Color from 'color';
import ColorTime from 'color-time';
import Logo from 'App/Header/Logo';
import { Link } from 'react-router';

const colorTimeConfig = {
    34: '#0099CC',
    124: '#009933',
    157: '#c2c021',
    170: '#ca8d17',
    217: '#CC0066',
    maxAgeYears: 15,
    maxAgeFilterPercentage: 0.9,
    agingFn: 'greyscale'
};
const colorTime = ColorTime(colorTimeConfig);
const color = colorTime();
const backgroundColor = Color(color).darken(0.6).hexString();

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
    ],
    color: backgroundColor
};

const App = ({ children }) => {
    return (
        <div id="app">
            <Helmet
                {...meta}
            />

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
    ])
};

export default App;

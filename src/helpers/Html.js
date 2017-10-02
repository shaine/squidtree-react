/* eslint-disable react/no-danger */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';

const domain = 'https://www.squidtree.com/';

function mapStateToProps(state, { redialProps }) {
    const serializedRedialProps = serialize(redialProps || []);
    const serializedStore = serialize(state);

    return {
        serializedRedialProps,
        serializedStore
    };
}

export const Html = ({
    assets,
    component,
    serializedRedialProps,
    serializedStore
}) => {
    // This is rendered separately because this is the only part the client
    // app rerenders, so the checksum of this element needs to match this
    // separately from the checksum of the outer (Html) render
    const content = component ? ReactDOM.renderToString(component) : '';
    // https://github.com/nfl/react-helmet#server-usage
    const head = Helmet.rewind();
    const publicPath = __DEVELOPMENT__ ? '' : `${domain}public/`;

    const css = `
        body {
            background-color: #f7f7f7;
            color: #333;
            font-family: "Helvetica Neue", Helvetica, sans-serif;
            font-size: 16px;
        }

        #app {
            box-sizing: border-box;
            left: 0px;
            padding: 0 10px;
            position: absolute;
            text-align: center;
            top: 0px;
            width: 100%;
        }

        ul, li {
            list-style: none;
            padding: 0;
        }

        a:link, a:visited {
            color: #666;
            text-decoration: none;
        }

        a:active, a:hover {
            text-decoration: underline;
        }

        .nav {
            line-height: 30px;
        }

        .nav li {
            display: inline-block;
            margin-right: 20px;
        }

        .nav li:after {
            content: "\\2022";
            padding-left: 20px;
        }

        .nav li:last-child {
            margin: 0;
        }

        .nav li:last-child:after {
            content: "";
            padding: 0;
        }
    `;

    const gaCode = `
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-27614378-2', 'auto');
        ga('send', 'pageview');
    `;

    return (
        <html lang="en">
            <head>
                {head.base.toComponent()}
                {head.title.toComponent()}
                {head.meta.toComponent()}
                {head.link.toComponent()}
                {head.script.toComponent()}

                <link rel="shortcut icon" href={`${publicPath}favicon.ico`} />
                {/* styles (will be present only in production with webpack extract text plugin) */}
                {Object.keys(assets.styles).map((style, key) =>
                    <link
                        charSet="UTF-8"
                        href={`${publicPath}${assets.styles[style]}`}
                        key={key}
                        media="screen, projection"
                        rel="stylesheet"
                        type="text/css"
                    />
                )}
                <style dangerouslySetInnerHTML={{ __html: css }} />

                <script dangerouslySetInnerHTML={{ __html: gaCode }} />
            </head>
            <body>
                <div id="main-container" dangerouslySetInnerHTML={{ __html: content }} />
                <script dangerouslySetInnerHTML={{ __html: `window.__data=${serializedStore};` }} charSet="UTF-8" />
                <script dangerouslySetInnerHTML={{ __html: `window.__REDIAL_PROPS__=${serializedRedialProps};` }} charSet="UTF-8" />
                <script src={`${publicPath}${assets.javascript.client}`} charSet="UTF-8" defer />
            </body>
        </html>
    );
};

Html.propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    serializedRedialProps: PropTypes.string,
    serializedStore: PropTypes.string
};

export default connect(mapStateToProps)(Html);

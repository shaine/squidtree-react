import React from 'react';
import Helmet from 'react-helmet';

const ErrorPage = ({
    error
}) => (
    <div className="errorPage">
        <Helmet
            title={error}
        />

        {error}
    </div>
);

ErrorPage.defaultProps = {
    error: 'Not found'
};

export default ErrorPage;

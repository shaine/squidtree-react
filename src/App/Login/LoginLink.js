import React, { PropTypes } from 'react';

const LoginLink = ({ isLoggedIn }) =>
    (isLoggedIn ?
        <a href="/logout">Logout</a> :
        <a href="/login">Login</a>);

LoginLink.propTypes = {
    isLoggedIn: PropTypes.bool
};

LoginLink.defaultProps = {
    isLoggedIn: false
};

export default LoginLink;

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

@connect()
export default class Login extends Component {
    static propTypes = {
        isLoggedIn: PropTypes.bool
    }

    static defaultProps = {
        isLoggedIn: false
    }

    render() {
        return (<div className="loginPage">
            <form action="/api/login" method="post">
                <input type="text" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />

                <button type="submit">Submit</button>
            </form>
        </div>);
    }
}

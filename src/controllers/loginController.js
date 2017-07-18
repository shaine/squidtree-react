const _get = require('lodash/get');
const User = require('../models/User');

module.exports = function loginController(req, res) {
    const session = req.session;
    const {
        email,
        password
    } = _get(req, 'body', {});

    User.getUserByEmailAndPassword((email || ''), (password || ''), (error, user) => {
        session.user = user;

        if (user) {
            res.status(200).json({
                message: 'Successfully logged in',
                user
            });
        } else {
            res.status(401).json({
                message: 'Invalid email or password'
            });
        }
    });
};

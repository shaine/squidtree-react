module.exports = function apiController(req, res, next) {
    const acceptsJson = req.headers.accepts === 'application/json';
    const contentTypeJson = req.headers['content-type'] === 'application/json';

    if (acceptsJson && contentTypeJson) {
        next();
    } else if (!contentTypeJson) {
        res.status(415).json({
            error: 'Unsupported Media Type'
        });
    } else if (!acceptsJson) {
        res.status(415).send('Unsupported Media Type');
    }
};

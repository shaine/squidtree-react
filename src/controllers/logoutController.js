module.exports = function logoutController(req, res) {
    req.session.destroy(() => {
        res.sendStatus(204);
    });
};

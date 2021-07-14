
const { auth } = require('./firebase-config');
module.exports = {
    ensureAuthenticated: function (req, res, next) {
        const sessionCookie = req.cookies.session || "";
        auth.verifySessionCookie(sessionCookie, true)
            .then((DecodedClaim) => {
                req.user = DecodedClaim;
                next();
            })
            .catch((err) => {
                res.status(401).send();
            });
    },
    forwardAuthenticated: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/dashboard');
    },
};
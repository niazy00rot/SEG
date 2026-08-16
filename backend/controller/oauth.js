const router = require('express').Router();
const passport = require('passport');

const google_call_back = async (req, res) => {
    try {
        console.log(req.user);

        res.json({
            message: 'Google login successful',
            user: req.user
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/login'
    }),
    google_call_back
);

module.exports = router;
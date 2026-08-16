const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const google_call_back = async (req, res) => {
    try {
        const token = jwt.sign(
            {
                id: req.user.id
            },
            process.env.jwt_secret,
            {
                expiresIn: '15m'
            }
        );

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000
        });

        res.redirect('https://seg-navy.vercel.app/en');

    } catch (error) {
        console.error('Google callback error:', error);

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
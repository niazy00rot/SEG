const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {get_user_role} = require('../service/users.js');

const google_call_back = async (req, res) => {
    try {
        const token = jwt.sign(
            {
                id: req.user.id
            },
            process.env.jwt_secret,
            {
                expiresIn: "15m"
            }
        );
        const role_name = await get_user_role(req.user.id)

        res.status(200).json({message: 'Login successful', token, role: role_name})

        res.redirect("https://seg-navy.vercel.app/en");

    } catch (error) {
        console.error("Google callback error:", error);

        res.status(500).json({
            message: "Something went wrong"
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
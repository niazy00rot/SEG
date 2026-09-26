const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const frontend_url = process.env.FRONTEND_URL || 'https://seg-navy.vercel.app';

const google_call_back = async (req, res) => {
    try {
        const token = jwt.sign({id: req.user.id},process.env.jwt_secret,{expiresIn: "15m"});

        return res.cookie("session", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 60 * 60 * 1000
            }).redirect(`${frontend_url}/en`);

    } 
    catch (error) {
        console.error("Google callback error:", error);
        return res.status(500).json({message: "Something went wrong"});
    }
};

router.get('/google',passport.authenticate('google', {scope: ['profile', 'email']})
);

router.get('/google/callback',passport.authenticate('google', {
        session: false,
    failureRedirect: `${frontend_url}/en/login`
    }),
    google_call_back
);

module.exports = router;
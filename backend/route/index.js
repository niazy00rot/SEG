const router = require('express').Router()
// logout api
router.post('/logout', (req, res) => {
    res.clearCookie('session', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0,
        path: "/",
    }).json({message: "Logged out successfully"})
})

module.exports = router
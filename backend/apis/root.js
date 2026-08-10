const router = require('express').Router()

router.get('/', async (req, res) => {
    res.json({ message: 'API is running' })
})

module.exports = router
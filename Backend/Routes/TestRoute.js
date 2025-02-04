const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Ping! Route hit!');
})


module.exports = router;
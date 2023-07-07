const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/api-key', (req, res) => {
res.send(process.env.OPEN_AI_API_KEY);
});

// router.get(/.*/, (req, res) => {
//     res.sendFile(path.join(__dirname, './index.html'));
// });

// router.use('*', (req, res) => {
//     res.status(404).json({ message: 'Not Found' });
// });

module.exports = router;
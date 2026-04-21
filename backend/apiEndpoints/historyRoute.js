const express = require('express');
const router = express.Router();
const { get, clear } = require('../controllers/historyControl');

router.get('/history', get);
router.delete('/history', clear);

module.exports = router;
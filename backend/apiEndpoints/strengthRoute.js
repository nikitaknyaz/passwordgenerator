const express = require('express');
const router = express.Router();
const { check } = require('../controllers/strengthControl');

router.post('/check-strength', check); // post запрос на проверку силы

module.exports = router;
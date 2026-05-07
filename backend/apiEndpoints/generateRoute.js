const express = require('express');
const router = express.Router();
const { generate } = require('../controllers/generateControl');

// эндпоинт: post /api/generate
// принимает настройки генерации, возвращает пароль и историю
router.post('/generate', generate);

module.exports = router;
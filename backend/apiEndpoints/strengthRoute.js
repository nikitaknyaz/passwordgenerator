// роутер для эндпоинта проверки силы пароля

const express = require('express');
const router = express.Router();
const { check } = require('../controllers/strengthControl');

// эндпоинт: post /api/check-strength
// принимает пароль, возвращает оценку силы
router.post('/check-strength', check);

module.exports = router;
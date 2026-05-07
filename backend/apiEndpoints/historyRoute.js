// роутер для эндпоинтов работы с историей

const express = require('express');
const router = express.Router();
const { get, clear } = require('../controllers/historyControl');

// эндпоинт: get /api/history
// возвращает последние 10 паролей
router.get('/history', get);

// эндпоинт: delete /api/history
// очищает всю историю
router.delete('/history', clear);

module.exports = router;
/*
    Исходный код, полностью бесплатный.
    По всем вопросам: https://t.me/cs_041
*/

const express = require('express');
const router = express.Router();

const userRoute = require('./user');

router.use(userRoute);

module.exports = router;
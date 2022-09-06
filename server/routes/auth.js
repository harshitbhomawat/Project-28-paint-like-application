const express = require('express');
const router = express.Router();
const {loggedIn }= require('../middlewares/auth');
const { signup, signin, canvas } = require('../controllers/auth');
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/canvas', loggedIn, canvas);
module.exports = router;
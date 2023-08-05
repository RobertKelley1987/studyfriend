const express = require('express');
const router = express.Router({ mergeParams: true });
const users = require('../controllers/users');
const { validateUser } = require('../validation');

router.get('/session', users.getSession);
router.post('/signup', validateUser, users.create);
router.post('/login', users.logIn);
router.post('/logout', users.logOut);

module.exports = router;
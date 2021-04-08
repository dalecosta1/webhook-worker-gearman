const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/login', login);
router.post('/webhook', webhook);
router.post('/encode', encode);
router.get('/', getAll);

module.exports = router;

function login(req, res, next) {
    userService.login(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function webhook(req, res, next) {
    userService.webhook(req.body)
    .then(user => res.json(user))
    .catch(next);
}

function encode(req, res, next) {
    userService.encode(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}




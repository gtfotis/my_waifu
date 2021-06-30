'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UsersModel = require('../models/Users');

router.get('/signup', (req, res) => {
    res.render('template', {
        locals: {
            title: 'Register',
            is_logged_in: req.session.is_logged_in
        },
        partials: {
            body: 'partials/signup',
        }
    });
});

router.get('/login', (req, res) => {
    res.render('template', {
        locals: {
            title: 'Log In',
            is_logged_in: req.session.is_logged_in
        },
        partials: {
            body: 'partials/login',
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


router.post('/signup', async(req, res) => {
    const { user_name, user_email, user_pass } = req.body;

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(user_pass, salt);

    const response = await UsersModel.addUser(user_name, user_email, hash);
    console.log('post response is: ', response);
    if (response.id) {
        res.redirect('/users/login');
    } else {
        res.status(500).send('ERROR: Please try submitting the form again. ');
    }
});

router.post('/login', async(req, res) => {
    const { user_name, user_pass } = req.body;
    const user = new UsersModel(null, user_name, null, user_pass);
    console.log(user);
    const response = await user.login();
    console.log('user login response: ', response);

    if (!!response.isValid) {
        const { isValid, user_id, user_name, user_email } = response;

        req.session.is_logged_in = isValid;
        req.session.user_id = user_id;
        req.session.user_name = user_name;
        req.session.user_email = user_email;

        res.redirect('/');
    } else {
        res.sendStatus(403);
    }
});

module.exports = router;
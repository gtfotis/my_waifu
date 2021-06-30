'use strict';
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const session = require('express-session')
const app = express();

const es6renderer = require('express-es6-template-engine');
app.engine('html', es6renderer);
app.set('views', './views');
app.set('view engine', 'html');

const helmet = require('helmet');
app.use(helmet());
const morgan = require('morgan');
const logger = morgan('tiny');
require('dotenv').config();
const pgp = require('pg-promise');

app.use(session({
    secret: 'get waifus!',
    resave: false,
    saveUninitialized: false,
    is_logged_in: false
}));

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
});

const rootController = require('./routes/index');
const userController = require('./routes/users');

app.use('/', rootController);
app.use('/users', userController);
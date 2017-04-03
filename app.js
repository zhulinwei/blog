'use strict'

const ejs = require('ejs');
const path = require('path');
const log4js = require('log4js');
const express = require('express');
const Promise = require('bluebird');
const cookie = require('cookie-parser');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const session = require('express-session');
const errorhandler = require('errorhandler');
const redis = require('./models/db.js').redis;
const mongoose = require('./models/db.js').mongoose;

global.redis = redis;
global.Promise = Promise;
global.mongoose = mongoose;
global.dirname = process.cwd();


const app = express();

let log = log4js.getLogger('logInfo');
log4js.configure(path.join(dirname, 'util/log4js.json'));

// 设置ejs引擎
app.set('views', path.resolve(__dirname,'views'));
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);
ejs.delimiter = "$";

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use(cookie());
app.use(session({
    secret: 'blog',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: { "maxAge": 1000 * 60 * 60 }
}));

app.use('/', require('./routes/index.js'));

app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler());
}

app.use(function (req, res, next) {
    res.status(404).end('404 the page cannot found');
});

app.use(function (err, req, res) {
    res.status(500).end('500 the server is busy')
});

process.on('uncaughtException', function (err) {
    log.error(err.stack);
})

app.listen(3451, () => {
	console.log('服务器开启成功')
})


module.exports = app;
'use strict';

var Express = require('express');
var Request = require('superagent');
var BodyParser = require('body-parser');
var isProduction = process.env.NODE_ENV === 'production';
var ConfigBuilder = require('./config.js');
var config = new ConfigBuilder(isProduction);

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
};

var app = Express();
app.use(allowCrossDomain);
app.use(BodyParser.json());

app.post('/get/basic/:page', function (req, res) {
    var user = req.body;
    var page = req.params.page;
    core.getKnettFeedBasic(user, page, function (coreRes) {
        res.send(coreRes);
    });
});

app.post('/get/cookie/:page', function (req, res) {
    var cookie = req.body.cookie;
    var page = req.params.page;
    core.getKnettFeedCookie(cookie, page, function (coreRes) {
        res.send(coreRes);
    });
});

var core = {

    getKnettFeedCookie: function (cookie, page, callback) {
        Request
            .get(config[page])
            .set('Cookie', cookie)
            .end(function (err, res) {
                if (err) {
                    callback(err);
                } else {
                    callback(res)
                }
            });
    },
    getKnettFeedBasic: function (user, page, callback) {
        Request
            .get(config[page])
            .set('X-IKB-AUTH', 'Basic')
            .auth(user.userName, user.password)
            .end(function (err, res) {
                if (err) {
                    callback(err);
                } else {
                    callback(res)
                }
            });
    }
};

var server = app.listen(process.env.PORT || 5000, function () {
    console.log('knett-api lytter på port: ' + server.address().port);
});


'use strict';

var Express = require('express');
var Request = require('superagent');
var BodyParser = require('body-parser');

var isProduction = process.env.NODE_ENV === 'production';
var ConfigBuilder = require('./config.js');
var config = new ConfigBuilder(isProduction);

var feedUrl = config.feedUrl;

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

app.get('/feed/get', function (req, res) {
    core.getKnettFeed(function (coreRes) {
        res.send(JSON.parse(coreRes.text))
    });
});

app.post('/login', function (req, res) {
    var cookie = req.body.cookie;
    core.getKnettFeed(cookie, function (coreRes) {
        res.send(coreRes);
    });
});

var core = {

    getKnettFeed: function (cookie, callback) {
        Request
            .get(feedUrl)
            .set('Cookie', cookie)
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


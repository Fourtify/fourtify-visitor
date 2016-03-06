var dotenv = require('dotenv');
dotenv.load();
var environment = process.env.NODE_ENV;

var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var request = require('request');

var routes = require('./routes/index');
var config = require('./config/config.json')[environment];
var API_URL = config.apiUrl;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower', express.static(path.join(__dirname, 'bower_components')));


// deny entry into the app if domain is not found
app.use(function(req, res, next) {
    var domainArr = req.headers.host.split(".");
    var domain = domainArr[0];

    if(environment=="production" && domainArr[1]!="fourtify"){
        res.status(500).send("Domain must be fourtify.us");
        return;
    }

    request({
            method: "GET",
            uri: API_URL+"/providers?domain="+domain
        },
        function (error, response, body) {
            if (error) {
                return res.status(500).send({_code:"SITE002", _msg:"Connection to API failed. Please try again later."});
            }
            else if(response.statusCode == 500){
                return res.status(500).send("Domain is not found. Please make sure your site is registered at http://fourtify.us");
            }
            else{
                req.provider = JSON.parse(body);
                next();
            }
        });
});


app.use('/', routes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('index', {
        message: err.message,
        error: {}
    });
});



module.exports = app;

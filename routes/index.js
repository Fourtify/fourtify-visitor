var environment = process.env.NODE_ENV;
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var async = require('async');
var request = require("request");

var config = require('../config/config.json')[environment];
var API_URL = config.apiUrl;

/*** Templates ****/
// GET - Index
router.get('/templates/index', function (req, res) {
    res.render("index", {
        provider: req.provider
    }); //index
});

router.get('/templates/information', function (req, res) {
    res.render("information", {
        provider: req.provider
    });
});

router.get('/templates/confirmation', function (req, res) {
    res.render("confirmation", {
        provider: req.provider
    });
});

router.get('/templates/waiver', function (req, res) {
    res.render("waiver", {
        provider: req.provider
    });
});

router.get('/templates/confirmed', function (req, res) {
    res.render("confirmed", {
        provider: req.provider
    });
});

router.get('/templates/apptNotFound', function (req, res) {
    res.render("apptNotFound", {
        provider: req.provider
    });
});

/*
*   OTHER API
*/
router.all("/api", function(req, res){
    request({
            headers: {
                "Authorization": "Basic "+(new Buffer(req.provider._clientId+":"+req.provider._clientSecret).toString('base64')),
            },
            method: req.method,
            uri: API_URL+req.headers.url,
            qs: req.query,
            json: req.body
        },
        function (error, response, body) {
            if (error) {
                console.log(error);
                return res.status(500).send({_code:"BMS002", _msg:"Connection to API failed. Please try again later."});
            }
            res.status(response.statusCode).send(body);
        });
});

/*
 *   VIEWS
 */
// GET - Index
router.get('/*', function (req, res) {
    res.render("layout");
});


module.exports = router;


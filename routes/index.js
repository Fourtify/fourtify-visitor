var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var async = require('async');

/*** Templates ****/
// GET - Index
router.get('/templates/index', function (req, res) {
    console.log(req.provider);
    console.log(req.provider._name);
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
*   VIEWS
*/
// GET - Index
router.get('/*', function (req, res) {
    res.render("layout");
});

/*
*   OTHER API
*/

module.exports = router;

var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var async = require('async');

/*** Templates ****/
// GET - Index
router.get('/templates/index', function (req, res) {
    res.render("index"); //index
});

router.get('/templates/information', function (req, res) {
    res.render("information");
});

router.get('/templates/confirmation', function (req, res) {
    res.render("confirmation");
});

router.get('/templates/waiver', function (req, res) {
    res.render("waiver");
});

router.get('/templates/confirmed', function (req, res) {
    res.render("confirmed");
});

router.get('/templates/apptNotFound', function (req, res) {
    res.render("apptNotFound");
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

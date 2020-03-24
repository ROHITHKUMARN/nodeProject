'use strict';

const express = require('express');
const router = express.Router();


router.get('/employeelist', function(req, res) {
  return res.redirect('../views/employeelist.html');
});

router.get('/newemployee', function(req, res) {
  return res.redirect('../views/newemployee.html');
});

router.get('/', function(req, res) {
  return res.redirect('../views/index.html');
});

module.exports = router;
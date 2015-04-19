'use strict';

var path = require('path');
var express = require('express');
var compression = require('compression');

var app = module.exports = express();

var pub = path.join(__dirname, '../public');
var assets = path.join(__dirname, '../assets');

app.use(compression());
app.use(express.static(pub));
app.use(express.static(assets));

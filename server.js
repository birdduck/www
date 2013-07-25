var app = require('./lib');
require('http').createServer(app('./public', { gzip: true })).listen(process.env.PORT || 5000);
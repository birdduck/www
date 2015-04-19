'use strict';

require('http').createServer(require('./lib')).listen(process.env.PORT || 5000);

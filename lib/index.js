var static = require('node-static');

module.exports = function (path, options) {
    var fileServer = new static.Server(path, options || {});
    return function (req, res) {
        req.addListener('end', function () {
            fileServer.serve(req, res);
        }).resume();
    };
};
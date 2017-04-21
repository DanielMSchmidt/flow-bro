const execFile = require('child_process').execFile;
const toPromise = require('./to-promise');

module.exports = function flowStatus(options) {
    return toPromise(execFile, './node_modules/.bin/flow', ['stop']);
};

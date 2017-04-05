const exec = require('child_process').exec;
const toPromise = require('./to-promise');
module.exports = function getFiles() {
    return toPromise(exec, 'git ls-files')
        .then(fileString => fileString.split('\n'))
        .then(files => files.filter(file => file !== ''))
        .then(files => files.filter(file => file.indexOf('.js') !== -1))
        .then(files =>
            files.filter(file => file.indexOf('flow-typed/npm') === -1));
};

const exec = require('child_process').exec;
const execFile = require('child_process').execFile;
const ThrottledPromise = require('throttled-promise');
const toPromise = require('./to-promise');
const getFlowCoverage = require('./get-flow-coverage');

module.exports = function(amount) {
    return toPromise(exec, 'git ls-files')
        .then(fileString => fileString.split('\n'))
        .then(files => files.filter(file => file !== ''))
        .then(files => files.filter(file => file.indexOf('.js') !== -1))
        .then(files =>
            files.filter(file => file.indexOf('flow-typed/npm') === -1))
        .then(files =>
            files.map(
                file =>
                    new ThrottledPromise((resolve, reject) =>
                        getFlowCoverage(file).then(
                            result => resolve(result),
                            error => reject(error)
                        ))
            ))
        .then(filePromises => ThrottledPromise.all(filePromises, 4))
        .then(files => files.sort((a, b) => a.result - b.result))
        .then(files => files.slice(0, amount));
};

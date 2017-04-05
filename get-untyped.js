const exec = require('child_process').exec;
const execFile = require('child_process').execFile;
const ThrottledPromise = require('throttled-promise');

function toPromise(fn, ...args) {
    return new Promise((resolve, reject) => {
        fn(...args, (error, stdout, stderr) => {
            if (error) {
                reject(stderr);
            }

            resolve(stdout);
        });
    });
}

function getFlowCoverage(filePath) {
    const startValue = 'Covered:';
    const endValue = '\% (';

    return toPromise(execFile, './node_modules/.bin/flow', [
        'coverage',
        filePath,
        '--json',
    ])
        .then(result => JSON.parse(result))
        .then(({ expressions }) => {
            return {
                file: filePath,
                result: expressions.covered_count / expressions.covered_count +
                    expressions.uncovered_count,
            };
        });
}

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

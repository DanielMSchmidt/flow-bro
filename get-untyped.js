var exec = require('child_process').exec;
var execFile = require('child_process').execFile;

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

    return toPromise(
        execFile,
        './node_modules/.bin/flow',
        ['coverage', filePath],
        {
            cwd: __dirname + '/..',
        }
    )
        .then(result => {
            const startOfValue = result.indexOf(startValue) +
                startValue.length +
                1;
            const endOfValue = result.indexOf(endValue);

            if (startOfValue === -1 || endOfValue === -1) {
                throw 'wrong format';
            }

            return {
                file: filePath,
                result: parseFloat(result.substring(startOfValue, endOfValue)),
            };
        })
        .catch(err => {});
}

module.exports = function(amount) {
    return toPromise(exec, 'git ls-files')
        .then(fileString => fileString.split('\n'))
        .then(files => files.filter(file => file !== ''))
        .then(files => files.filter(file => file.indexOf('.js') !== -1))
        .then(files => files.map(file => getFlowCoverage(file)))
        .then(filePromises => Promise.all(filePromises))
        .then(files => files.sort((a, b) => a.result - b.result))
        .then(files => files.slice(0, amount));
};

const ThrottledPromise = require('throttled-promise');
const getFiles = requre('./get-files');
const toPromise = require('./to-promise');
const getFlowCoverage = require('./get-flow-coverage');

module.exports = function(amount) {
    return getFiles()
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

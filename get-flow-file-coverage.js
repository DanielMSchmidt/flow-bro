const execFile = require('child_process').execFile;
const toPromise = require('./to-promise');

module.exports = function getFlowCoverage(filePath) {
    const startValue = 'Covered:';
    const endValue = '\% (';

    return toPromise(execFile, './node_modules/.bin/flow', [
        'coverage',
        filePath,
        '--json',
    ])
        .then(result => JSON.parse(result))
        .then(({ expressions }) => ({
            file: filePath,
            covered: expressions.covered_count,
            all: expressions.covered_count + expressions.uncovered_count,
            result: expressions.covered_count /
                (expressions.covered_count + expressions.uncovered_count),
        }));
};

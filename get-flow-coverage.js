module.exports = function getFlowCoverage(filePath) {
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
                result: expressions.covered_count /
                    (expressions.covered_count + expressions.uncovered_count),
            };
        });
};

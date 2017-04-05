const getFlowCoverage = require('./get-flow-coverage');

module.exports = function(amount) {
    return getFlowCoverage().then(files => ({
        covered: files.reduce((sum, { covered }) => sum + covered, 0),
        all: files.reduce((sum, { all }) => sum + all, 0),
    }));
};

const getFlowCoverage = require("./get-flow-coverage");

module.exports = function(amount) {
  return getFlowCoverage()
    .then(files => files.sort((a, b) => a.result - b.result))
    .then(files => files.slice(0, amount));
};

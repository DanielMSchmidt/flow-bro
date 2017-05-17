const ThrottledPromise = require("throttled-promise");
const getFiles = require("./get-files");
const toPromise = require("./to-promise");
const getFlowFileCoverage = require("./get-flow-file-coverage");

module.exports = function() {
  console.log(
    "This may take a while, concurrency is limited to reduce the failure rate."
  );
  console.log("Why dont you go get a coffee, I will do the heavy lifting!\n");
  return getFiles()
    .then(files =>
      files.map(
        file =>
          new ThrottledPromise((resolve, reject) =>
            getFlowFileCoverage(file).then(
              result => resolve(result),
              error => reject(error)
            )
          )
      )
    )
    .then(filePromises => ThrottledPromise.all(filePromises, 4));
};

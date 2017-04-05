#!/usr/bin/env node

const cli = require('commander');
const fs = require('fs');
const getUntyped = require('./get-untyped');
const getProjectCoverage = require('./get-project-coverage');
const Table = require('cli-table');

const checkForFlowToExist = () => {
    return fs.existsSync('./node_modules/.bin/flow');
};

cli
    .command('get-untyped <number>')
    .description('returns the X least flow-typed files')
    .action(function(rawAmount) {
      if (!checkForFlowToExist()) {
          console.log('We expect a local version of flow');
          return;
      }
      const amount = rawAmount ? parseInt(rawAmount) : 20;

      getUntyped(amount)
          .then(files => {
              console.log(
                  'The following files have the least flow coverage: \n'
              );
              var table = new Table({
                  head: ['%', 'File'],
                  colWidths: [10, 80],
              });
              files.forEach(({ file, result }) => table.push([result, file]));

              console.log(table.toString());

              console.log('\nI am sure you can improve them!');
          })
          .catch(error => {
              console.error('Something went wrong, I am sorry:');
              console.error(error);
          });
    });

cli
  .command('project-coverage')
  .description('Gets your overall coverae');
  .action(function() {
    if (!checkForFlowToExist()) {
        console.log('We expect a local version of flow');
        return;
    }

    getProjectCoverage().then(({covered, all}) => {
      console.log('You have a coverage of', covered / all, '%\n');
      console.log('Covered Lines:', covered);
      console.log('Total Lines:', all);
    });
  })

cli.parse(process.argv);

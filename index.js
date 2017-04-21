#!/usr/bin/env node

const cli = require('commander');
const fs = require('fs');
const Table = require('cli-table');

const getUntyped = require('./get-untyped');
const getProjectCoverage = require('./get-project-coverage');
const flowStatus = require('./flow-status');

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
                    colWidths: [10, 80]
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
    .alias('coverage')
    .description('Gets your overall coverage')
    .action(function() {
        if (!checkForFlowToExist()) {
            console.log('We expect a local version of flow');
            return;
        }

        getProjectCoverage().then(({ covered, all }) => {
            console.log('You have a coverage of', covered / all * 100, '%\n');
            console.log('Covered Lines:', covered);
            console.log('Total Lines:', all);
        });
    });

cli
    .command('watch')
    .alias('w')
    .alias('watch-that-shit')
    .description('Watches file changes and executes flow')
    .action(function() {
        if (!checkForFlowToExist()) {
            console.log('We expect a local version of flow');
            return;
        }
        const callFlow = () =>
            flowStatus()
                .then(result => console.log(result))
                .catch(error => console.log(error));

        callFlow();
        fs.watch('./', { persistent: true, recursive: true }, callFlow);

        process.on('SIGINT', function() {
            console.log('Caught interrupt signal');
            process.exit();
        });
    });

cli.parse(process.argv);

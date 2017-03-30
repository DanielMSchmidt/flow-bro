#!/usr/bin/env node

var cli = require('commander');
var fs = require('fs');
var getUntyped = require('./get-untyped');
var Table = require('cli-table');

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
        console.log(
            'This may take a while, concurrency is limited to reduce the failure rate.'
        );
        console.log(
            'Why dont you go get a coffee, I will do the heavy lifting!\n'
        );
        getUntyped(amount)
            .then(files => {
                console.log(
                    'The following files have the least flow coverage: \n'
                );
                var table = new Table({
                    head: ['%', 'File'],
                    colWidths: [10, 80],
                });
                files.forEach(({file, result}) => table.push([result, file]));

                console.log(table.toString());

                console.log('\nI am sure you can improve them!');
            })
            .catch(error => {
                console.error('Something went wrong, I am sorry:');
                console.error(error);
            });
    });

cli.parse(process.argv);

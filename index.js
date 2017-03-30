#!/usr/bin/env node

var cli = require('commander');
var getUntyped = require('./get-untyped');

cli
    .command('get-untyped <number>')
    .description('returns the X least flow-typed files')
    .action(function(rawAmount) {
        const amount = rawAmount ? parseInt(rawAmount) : 20;

        getUntyped(amount).then(files => {
            console.log(
                'The following files are the ones with the least flow coverage: \n'
            );
            console.log(
                files
                    .map(file => `${file.file} is ${file.result}% typed`)
                    .join('\n')
            );
            console.log('\n I am sure you can improve them!');
        });
    });

cli.parse(process.argv);

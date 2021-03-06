#!/usr/bin/env node

const cli = require("commander");
const fs = require("fs");
const Table = require("cli-table");
const clear = require("clear");
const ora = require("ora");

const getUntyped = require("./get-untyped");
const getProjectCoverage = require("./get-project-coverage");
const flowStatus = require("./flow-status");
const stopFlowServer = require("./flow-stop");

const checkForFlowToExist = () => {
  return fs.existsSync("./node_modules/.bin/flow");
};

cli
  .command("get-untyped <number>")
  .description("returns the X least flow-typed files")
  .action(function(rawAmount) {
    if (!checkForFlowToExist()) {
      console.log("We expect a local version of flow");
      return;
    }
    const amount = rawAmount ? parseInt(rawAmount) : 20;

    getUntyped(amount)
      .then(files => {
        console.log("The following files have the least flow coverage: \n");
        var table = new Table({
          head: ["%", "File"],
          colWidths: [10, 80]
        });
        files.forEach(({ file, result }) => table.push([result, file]));

        console.log(table.toString());

        console.log("\nI am sure you can improve them!");
      })
      .catch(error => {
        console.error("Something went wrong, I am sorry:");
        console.error(error);
      });
  });

cli
  .command("project-coverage")
  .alias("coverage")
  .description("Gets your overall coverage")
  .action(function() {
    if (!checkForFlowToExist()) {
      console.log("We expect a local version of flow");
      return;
    }

    getProjectCoverage().then(({ covered, all }) => {
      console.log("You have a coverage of", covered / all * 100, "%\n");
      console.log("Covered Lines:", covered);
      console.log("Total Lines:", all);
    });
  });

cli
  .command("watch")
  .alias("w")
  .description("Watches file changes and executes flow")
  .action(function() {
    if (!checkForFlowToExist()) {
      console.log("We expect a local version of flow");
      return;
    }
    let terminating = false;
    let spinner = null;
    let inProgess = false;

    const renewDisplay = () => {
      if (terminating || inProgess) {
        return;
      }

      inProgess = true;
      clear();
      if (!spinner) {
        spinner = ora("Checking the flow").start();
      }

      flowStatus()
        .then(result => {
          spinner.succeed("Looks great, good job!");
          console.log(result);
        })
        .catch(({ stdout }) => {
          if (terminating) {
            return;
          }

          spinner.fail("Dude, there was an error. Go fix it!");
          console.log(stdout);
        })
        .then(() => {
          inProgess = false;
        });
    };

    const stop = function() {
      terminating = true;
      if (spinner) {
        spinner.stop();
      }

      clear();
      spinner = ora(
        "Bye bro! I will just kill that flow-server real quick for you."
      ).start();

      stopFlowServer().then(() => {
        spinner.succeed();
        process.exit();
      });
    };

    renewDisplay();
    fs.watch("./", { persistent: true, recursive: true }, renewDisplay);
    process.on("SIGINT", stop);
  });

cli.parse(process.argv);

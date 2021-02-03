#!/usr/bin/env node

const debounce = require('lodash.debounce');
const chokidar = require('chokidar'); //chokidar is an npm package that helps in detecting file changes, file deletion and file creation  within a directory
const fs = require('fs');
const { spawn } = require('child_process');
const chalk = require('chalk');

const program = require('caporal');
//caporal is a fully-featured framework for building command line applications(cli) with node.js , including help generation, colored output, verbosity control, custom logger, coercion and casting, typos suggestions, and auto-complete for bash/zsh/fish.
program
    .version('0.0.1')
    .argument('[filename]', 'Name of a file to execute')
    .action(async ({filename }) => {
        const name = filename || 'index.js';

        try {
            await fs.promise.access(name);
        } catch (err) {
            throw new Error(`Could not find the file ${name}`);
        }


        let proc; //initiating process
        const start = debounce(() => {
            if (proc) {
                proc.kill(); //kills/stops whatever was going on in setInterval  process after triggering the debounce function
            }
            console.log(chalk.blue('>>>>>> process starting...'));
            proc = spawn('node', [name], {stdio: 'inherit'});
        }, 100); //invokes the debounce function 

        chokidar.watch('.') //'.' - means cureent directory
            .on('add', start)
            .on('change', start)
            .on('unlink', start);
    });
program.parse(process.argv);
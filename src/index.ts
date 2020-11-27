#!/usr/bin/env node

import * as cmds from './cmds';
import * as program from 'commander';

program.name('ymca').version('1.0.0', '-v', 'output the cli version');

// Apply all the functions to the program
for (const func of Object.values(cmds)) func(program);

// Show the info screen if no commands given
if (!process.argv.length) program.parse(['info']);

// Parse args
program.parse(process.argv);

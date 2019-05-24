#!/usr/bin/env node

const program = require('commander');
const version = require('../package.json').version;
const Init = require('../lib/init');

program.version(version, '-v --version')
  .command('init <name>')
  .action(async (name) => {
    Init(name);
  });

program.parse(process.argv);

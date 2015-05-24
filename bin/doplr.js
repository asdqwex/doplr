#! /usr/bin/env node
'use strict';

// Doplr.js CLI entry point

// https://github.com/bcoe/yargs
const argv = require('yargs')
  .count('verbose')
  .alias('v', 'verbose')
  .command('sweep', 'Discover a host, network, or cloud provider')
  .command('radar', 'Controls a local Doplr daemon, allowing for task backgrounding')
  .command('forecast', 'A CLI tool for browsing the forecast data')
  .command('weathergirl', 'Launches a web interface for Doplr')
  .demand(1)
  .example('doplr sweep myhost.com', 'gather information about myhost.com and add to forecast')
  .example('doplr forecast myhost.com', 'display known facts about myhost.com')
  .example('doplr radar start', 'start the doplr daemon')
  .example('doplr sweep --all --radar', 'have the daemon sweep all known infrastructure')
  .example('doplr radar start --weathergirl', 'start a daemon which will host the web interface')
  .example('doplr weathergirl --radar', 'have the running radar daemon start weathergirl')
  .help('h')
  .epilog('Created by Seandon "erulabs" Mooy and Matthew "asdqwex" Ellsworth')
  .argv;

// The first non-hypenated option is the "action"
const chosen_action = argv._[0];

// If we're gonna queue this message agianst a daemon...
if (argv.radar) {
  // Send messages to DAEMONs via HTTP (HTTPS eventually)
  const http = require('http');

  // POST /chosen_action { data: options } ...

// If we're going to do this ourselves, in this thread.
} else {
  const Doplr = require('./../lib/doplr.js');
  const doplr = new Doplr();

  // doplr[chosen_action](options) ...

}

#! /usr/bin/env node
'use strict';

// Doplr.js CLI entry point

// https://github.com/bcoe/yargs
const argv = require('yargs')
  .count('verbose')
  .alias('v', 'verbose')
  .argv;
const USAGE_STRING = 'Usage: doplr <action> [options...] [--options...]';
const ACTIONS = ['sweep', 'forecast', 'radar', 'weathergirl']
const ACTION_STRING = 'Available actions are: ' + ACTIONS.join(' ');

// If no non-hyphenated options are present - ie: no action
if (argv._.length === 0) {
  console.log(USAGE_STRING);
  process.exit(1);
}

// Help!
if (argv.help || argv.usage) {
  console.log(USAGE_STRING);
  process.exit(0);
}

const chosen_action = argv._[0];
// Note that this is the --radar option, which implies we're sending this _to_
// the a radar daemon. As opposed to 'doplr radar' which starts/stops the daemon
const SEND_TO_DAEMON = argv.radar;

// Make sure the action is one of ACTIONS
if (ACTIONS.indexOf(chosen_action) === -1) {
  console.log('No such action "' + chosen_action + '".');
  console.log(ACTION_STRING);
  process.exit(1);
}

// If we're gonna queue this message agianst a daemon...
if (SEND_TO_DAEMON) {
  // Send messages to DAEMONs via HTTP (HTTPS eventually)
  const http = require('http');

  // POST /chosen_action { data: options } ...

// If we're going to do this ourselves, in this thread.
} else {
  const Doplr = require('./../lib/doplr.js');
  const doplr = new Doplr();

  // doplr[chosen_action](options) ...

}

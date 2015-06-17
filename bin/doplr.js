#!/usr/bin/env node
'use strict';

// Doplr.js CLI entry point

// Load lib/doplr
const Doplr = require('./../lib');
const CONSTANTS = Doplr.CONSTANTS;

const fs = require('fs');
const path = require('path');

// https://github.com/bcoe/yargs
const yargs = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .count('verbose')
  .alias('v', 'verbose')
  .describe('v', 'verbosity, use twice for debug mode')
  .alias('i', 'ssh-key')
  .describe('i', 'ssh private key path')
  .alias('u', 'ssh-username')
  .describe('u', 'ssh username')
  .default('u', process.env.USER)
  .alias('p', 'ssh-port')
  .default('p', 22)
  .describe('p', 'ssh port')
  .alias('c', 'config')
  .describe('c', 'load configuration options from a .json file')
  .alias('d', 'db-path')
  .default('d', '.')
  .describe('d', 'use a specific db directory')
  .describe('s', 'be silent')
  .alias('s', 'silence')
  .default('s', false)
  .alias('P', 'radar-port')
  .default('radar-port', CONSTANTS.DEFAULT_RADARPORT)
  .describe('radar-port', "the port Doplr's API will bind to")
  .command('sweep', 'Discover a host, network, or cloud provider')
  .command('forecast', 'Explore the data Doplr has discovered')
  .command('radar', 'Doplr HTTP API')
  .example('doplr sweep', 'sweep all known infrastructure')
  .example('doplr sweep host foo.com', 'gather info about foo.com')
  .example('doplr forecast', 'display overview')
  .example('doplr radar', 'HTTP API')
  .help('h')
  .alias('h', 'help')
  .epilog('Visit https://github.com/asdqwex/doplr for more information!');

const argv = yargs.argv;
const log = require('./../lib/logger')(argv);

if (argv._.length === 0) {
  log(yargs.help());
  process.exit(1);
}

// Finds the nearest weather database, unless one has been specified
function locateDB (p) {
  const fp = p + path.sep + CONSTANTS.DEFAULT_DB_PATH;
  if (fs.existsSync(fp)) {
    return fp;
  }
  p = p.split(path.sep);
  p.pop();
  if (p.length > 0) {
    return locateDB(p.join(path.sep));
  }
  return false;
}

// The first non-hypenated option is the 'action'
const chosenAction = argv._[0];
argv._.shift();

// `doplr <action> --radar` implies a user wants to send this task to a radar daemon
if (argv.radar) {
  let radarUri = argv.radar;
  if (typeof radarUri !== 'string') {
    radarUri = CONSTANTS.DEFAULT_RADARURI;
  }
  // Send messages to DAEMONs via HTTP (HTTPS eventually)
  //const http = require('http');
  // POST /targetUri { data: options } ...
  log(CONSTANTS.UNIMPLIMENTED);

} else {

  const myDBPath = locateDB(
      path.resolve(argv['db-path'].replace(CONSTANTS.DEFAULT_DB_PATH, ''))
    ) || CONSTANTS.DEFAULT_DB_PATH;

  log.info(`DB path: ${myDBPath}`);

  // `doplr radar` Launch the API
  if (['r', 'ra', 'rad', 'rada', 'radar'].indexOf(chosenAction) > -1) {
    const radar = new Doplr.Radar({
      verbose: argv.verbose,
      silent: argv.silent,
      db: myDBPath
    });
    radar.listen(argv['radar-port']);

  // `doplr sweep <type> <target> [options]`
  } else if (['s', 'sw', 'swe', 'swee', 'sweep'].indexOf(chosenAction) > -1) {
    if (argv._.length === 0) {
      log('Usage: doplr sweep <host|network|cloud_provider|plugin_name> [options]\n',
          'Example: \n\t',
          'doplr sweep host myserver.com\n\t',
          'doplr sweep aws AWS_SECRET_ID AWS_SECRET_KEY\n',
          yargs.help());
      process.exit(1);
    }
    let sweepType = argv._.shift().toLowerCase();
    // Validate arguments for different sweep types
    // Host
    let type = '';
    let target = '';
    if (['h', 'ho', 'hos', 'host'].indexOf(sweepType) > -1) {
      type = CONSTANTS.HOST;
      if (argv._.length === 0) {
        log('You must provide a host to sweep!\n',
          yargs.help());
        process.exit(1);
      }
      target = argv._.shift();
      log.debug(`Beginning ${sweep.type} sweep on ${sweep.target}`);
      // Pass more options here...

    // Network
    } else if (['n', 'ne', 'net', 'netw', 'netwo', 'networ', 'network'].indexOf(sweepType) > -1) {
      type = CONSTANTS.NETWORK;
      // Validate arguments here
      log(CONSTANTS.UNIMPLIMENTED);

    // AWS
    } else if (['aws', 'ec2', 'amazon'].indexOf(sweepType) > -1) {
      type = CONSTANTS.AWS;
      // Validate arguments here
      log(CONSTANTS.UNIMPLIMENTED);

    // Google Cloud
    } else if (['google', 'gce', 'goog', 'gc'].indexOf(sweepType) > -1) {
      type = CONSTANTS.GOOGLE_CLOUD;
      // Validate arguments here
      log(CONSTANTS.UNIMPLIMENTED);

    // OpenStack
    } else if (['openstack'].indexOf(sweepType) > -1) {
      type = CONSTANTS.OPENSTACK;
      // Validate arguments here
      log(CONSTANTS.UNIMPLIMENTED);

    } else {
      // Assuming the TYPE is not a host, network or provider for which
      // we have customer arg parsing, we should do two things:
      // 1. We should check if we have a plugin loaded which matches this type
      if (typeof Doplr.Sweep.types[sweepType] === 'string') {
        sweepType = sweep.types[sweepType];
      }
      if (Doplr.Sweep.types[sweepType] === undefined) {
        type = 'host';
        target = sweepType;
      } else {
        type = sweepType;
      }
    }
    // Create new Sweep instance
    const sweep = new Doplr.Sweep({
      db: myDBPath,
      type: type,
      target: target
    });

    // Begin the sweep!
    sweep.begin();

  // `doplr forecast <categoryOrKeyword> [options]`
  } else if (['f', 'fo', 'for', 'fore', 'forec',
              'foreca', 'forecas', 'forecast'].indexOf(chosenAction) > -1) {

    // Spawn a radar
    const radar = new Doplr.Radar({
      verbose: argv.verbose,
      silent: argv.silent,
      db: myDBPath
    });
    radar.listen(argv['radar-port']);

    // CLI tool:
    // const forecast = new Doplr.Forecast({});
    // forecast.report();

    // Pop the browser!
    if (!argv.silent && // And we're not silent
    typeof argv['radar-port'] === 'number' && // And radar is listening on a TCP port
    process.platform !== 'linux') { // And we're not on linux (shrug)
      setTimeout(function () {
        const open = require('open');
        open('http://localhost:' + argv['radar-port']);
      }, 100);
    }

  } else {
    log(`No such action "${chosenAction}"\n\n`, yargs.help());
  }
}

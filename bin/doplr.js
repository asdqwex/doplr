#! /usr/bin/env node
"use strict";

// Doplr.js CLI entry point

// Load lib/doplr
const Doplr = require("./../lib");
const CONSTANTS = require("./../lib/constants.js");

const fs = require("fs");
const path = require("path");

// https://github.com/bcoe/yargs
const argv = require("yargs")
  .count("verbose")
  .alias("v", "verbose")
  .alias("i", "sshkey")
  .alias("u", "username")
  .alias("p", "port")
  .alias("c", "config")
  .alias("f", "forecast")
  .default("f", ".")
  .alias("r", "radar")
  .alias("w", "weathergirl")
  .command("sweep", "Discover a host, network, or cloud provider")
  .command("forecast", "A CLI tool for browsing the forecast data")
  .command("radar", "Controls a local Doplr daemon, allowing for task backgrounding")
  .command("weathergirl", "Launches a web interface for Doplr")
  .demand(1)
  .example("doplr sweep myhost.com", "gather information about myhost.com and add to forecast")
  .example("doplr forecast myhost.com", "display known facts about myhost.com")
  .example("doplr radar start", "start the doplr daemon")
  .example("doplr sweep --all --radar", "have the daemon sweep all known infrastructure")
  .example("doplr radar start --weathergirl", "start a daemon which will host the web interface")
  .example("doplr weathergirl --radar", "have the running radar daemon start weathergirl")
  .help("h")
  .epilog("Created by Seandon \"erulabs\" Mooy and Matthew \"asdqwex\" Ellsworth")
  .argv;

// Logging (should probably use winston here)
function logWarn () {
  if (argv.verbose) { console.log.apply(console, arguments); }
}
function logDebug () {
  if (argv.verbose > 1) { console.log.apply(console, arguments); }
}

// Find the nearest .forecast storage, unless one has been specified
function locateForecast (p) {
  const fp = p + path.sep + CONSTANTS.FORECAST_DIRECTORY;
  if (fs.existsSync(fp)) {
    return fp;
  }
  p = p.split(path.sep);
  p.pop();
  if (p.length > 0) {
    p = p.join(path.sep);
    return locateForecast(p);
  }
  return false;
}
let targetForecast = locateForecast(
  path.resolve(argv.forecast.replace(CONSTANTS.FORECAST_DIRECTORY, ""))
);
// If there isn't a forecast in the directory path, we'll create one here
if (!targetForecast) {
  logDebug("No forecast directory found, creating new...");
  targetForecast = CONSTANTS.FORECAST_DIRECTORY;
}
logWarn(`Using ${targetForecast}`);

// The first non-hypenated option is the "action"
// const chosenAction = argv._[0];

// If we're gonna queue this message agianst a daemon...
if (argv.radar) {
  // Send messages to DAEMONs via HTTP (HTTPS eventually)
  //const http = require("http");

  // POST /chosen_action { data: options } ...

// If we're going to do this ourselves, in this thread.
} else {
  //const doplr = new Doplr();

  // doplr[chosen_action](options) ...

}

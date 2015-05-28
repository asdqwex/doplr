#! /usr/bin/env node
"use strict";

// Doplr.js CLI entry point

// Load lib/doplr
const Doplr = require("./../lib");
const CONSTANTS = require("./../lib/constants");

const fs = require("fs");
const path = require("path");

// https://github.com/bcoe/yargs
const yargs = require("yargs")
  .count("verbose")
  .alias("v", "verbose")
  .alias("i", "ssh-key")
  .alias("u", "ssh-username")
  .alias("p", "ssh-port")
  .alias("c", "config")
  .alias("f", "forecast")
  .default("f", ".")
  .alias("r", "radar")
  .default("forecast-port", CONSTANTS.DEFAULT_FORECASTPORT)
  .alias("w", "weathergirl-port")
  .default("w", CONSTANTS.DEFAULT_WEATHERGIRLPORT)
  .command("sweep", "Discover a host, network, or cloud provider")
  .command("forecast", "A CLI tool for browsing the forecast data")
  .command("radar", "Controls a local Doplr daemon, allowing for task backgrounding")
  .command("weathergirl", "Launches a web interface for Doplr")
  .example("doplr sweep myhost.com", "gather information about myhost.com and add to forecast")
  .example("doplr forecast myhost.com", "display known facts about myhost.com")
  .example("doplr radar start", "start the doplr daemon")
  .example("doplr sweep --all --radar", "have the daemon sweep all known infrastructure")
  .example("doplr radar start --weathergirl", "start a daemon which will host the web interface")
  .example("doplr weathergirl --radar", "have the running radar daemon start weathergirl")
  .help("h")
  .epilog("Created by Seandon \"erulabs\" Mooy and Matthew \"asdqwex\" Ellsworth");

const argv = yargs.argv;

const LOG = require("./../lib/logger")(argv);

if (argv._.length === 0) {
  console.log(yargs.help());
  process.exit(1);
}

// Finds the nearest .forecast storage, unless one has been specified
function locateForecast (p) {
  const fp = p + path.sep + CONSTANTS.DEFAULT_FORECAST_DIRECTORY;
  if (fs.existsSync(fp)) {
    return fp;
  }
  p = p.split(path.sep);
  p.pop();
  if (p.length > 0) {
    return locateForecast(p.join(path.sep));
  }
  return false;
}

// The first non-hypenated option is the "action"
const chosenAction = argv._[0];

// `doplr radar` is the built-in service controller for a doplr daemon
if (chosenAction === "radar") {
  // Control process locally
  if (argv._.length === 1) {
    LOG.warn(CONSTANTS.RADAR_USAGE);
    process.exit(1);
  }
  // Use PM2 for service control - https://github.com/Unitech/PM2
  const pm2 = require("pm2");
  const serviceAction = argv._[1];
  // RADAR START
  if (serviceAction === "start") {
    pm2.connect(function (connectErr) {
      if (connectErr) {
        throw new Error(connectErr);
      }
      pm2.start("bin/radar.js", { name: "doplrRadar" }, function (startErr) {
        if (startErr) {
          throw new Error(startErr);
        }
        pm2.disconnect(function () {
          process.exit(0);
        });
      });
    });
  // RADAR STOP
  } else if (serviceAction === "stop") {
    pm2.connect(function (connectErr) {
      if (connectErr) {
        throw new Error(connectErr);
      }
      pm2.stop("doplrRadar", function (stopErr) {
        if (stopErr) {
          throw new Error(stopErr);
        }
        pm2.disconnect(function () {
          process.exit(0);
        });
      });
    });
  } else {
    LOG.warn(CONSTANTS.RADAR_USAGE);
    process.exit(1);
  }
// `doplr <action> --radar` implies a user wants to send this task to a radar daemon
} else if (argv.radar) {

  let radarUri = argv.radar;
  if (typeof radarUri !== "string") {
    radarUri = CONSTANTS.DEFAULT_RADARURI;
  }
  // Send messages to DAEMONs via HTTP (HTTPS eventually)
  //const http = require("http");
  // POST /chosenAction { data: options } ...
  LOG.warn(CONSTANTS.UNIMPLIMENTED);

// Run directly on this thread
} else {
  // Create a Doplr instance
  const doplr = new Doplr({
    // Locate the nearest .forecast - If none is found, we'll create one where we are
    targetForecast: locateForecast(
        path.resolve(argv.forecast.replace(CONSTANTS.DEFAULT_FORECAST_DIRECTORY, ""))
      ) || CONSTANTS.DEFAULT_FORECAST_DIRECTORY,
    verbose: argv.verbose
  });
  LOG.info(`Forecast directory: ${doplr.forecastPath}`);

  // Convert the CLI options into a URI
  // This implies 'doplr sweep host erulabs.com'
  // becomes '/sweep/host/erulabs.com'
  // Because we're passing directly to the Sweep class,
  // we don't actually need to prepend the URI with /sweep/...
  argv._.shift();
  const targetUri = argv._.join("/");

  // `doplr sweep <type> <target> [options]`
  if (chosenAction === "sweep" ||
      chosenAction === "scan" ||
      chosenAction === "s" ||
      chosenAction === "sw") {

    const sweep = new doplr.Sweep({
      targetUri: targetUri
    });
    sweep.begin();

  // `doplr forecast <categoryOrKeyword> [options]`
  } else if (chosenAction === "forecast" ||
             chosenAction === "f") {
    const forecast = new doplr.Forecast({
      targetUri: targetUri
    });
    forecast.report();

  // `doplr weathergirl`
  } else if (chosenAction === "weathergirl" ||
             chosenAction === "w") {
    const weathergirl = new doplr.WeatherGirl({});
    weathergirl.listen(argv["weathergirl-port"]);

  } else {
    LOG.warn(`No such action "${chosenAction}"`);
  }
}

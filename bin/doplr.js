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
  .usage("Usage: $0 <command> [options]")
  .count("verbose")
  .alias("v", "verbose")
  .describe("v", "verbosity, use twice for debug mode")
  .alias("i", "ssh-key")
  .describe("i", "ssh private key path")
  .alias("u", "ssh-username")
  .describe("u", "ssh username")
  .default("u", process.env.USER)
  .alias("p", "ssh-port")
  .default("p", 22)
  .describe("p", "ssh port")
  .alias("c", "config")
  .describe("c", "load configuration options from a .json file")
  .alias("f", "forecast-path")
  .default("f", ".")
  .describe("f", "use a specific forecast directory")
  .describe("s", "be silent")
  .alias("s", "silence")
  .default("s", false)
  .alias("P", "radar-port")
  .default("radar-port", CONSTANTS.DEFAULT_RADARPORT)
  .describe("radar-port", "the port Doplr's API will bind to")
  .alias("r", "radar")
  .describe("radar", "target a remote radar")
  .describe("no-weathergirl", "disable the web interface")
  .command("sweep", "Discover a host, network, or cloud provider")
  .command("forecast", "A CLI tool for browsing the forecast data")
  .command("radar", "Run Doplr as a server")
  .example("doplr sweep", "sweep all known infrastructure")
  .example("doplr sweep host foo.com", "gather info about foo.com")
  .example("doplr forecast", "display overview")
  .example("doplr forecast host foo.com", "display info about foo.com")
  .example("doplr radar", "launch the web interface")
  .example("doplr <command> --radar=radar.foo.com", "Run against a remote radar")
  .example("node ./bin/radar.js", "run your own radar server")
  .help("h")
  .alias("h", "help")
  .epilog("Visit https://github.com/asdqwex/doplr for more information!");

const argv = yargs.argv;

const log = require("./../lib/logger")(argv);

if (argv._.length === 0) {
  log(yargs.help());
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

// `doplr <action> --radar` implies a user wants to send this task to a radar daemon
if (argv.radar) {
  let radarUri = argv.radar;
  if (typeof radarUri !== "string") {
    radarUri = CONSTANTS.DEFAULT_RADARURI;
  }
  // Send messages to DAEMONs via HTTP (HTTPS eventually)
  //const http = require("http");
  // POST /chosenAction { data: options } ...
  log(CONSTANTS.UNIMPLIMENTED);

// Otherwise, they want to run things, not sent messages to a radar
} else {

  // The first non-hypenated option is the "action"
  const chosenAction = argv._[0];

  // Convert the CLI options into a URI
  // This implies 'doplr sweep host erulabs.com'
  // becomes '/sweep/host/erulabs.com'
  // Because we're passing directly to the Sweep class,
  // we don't actually need to prepend the URI with /sweep/...
  argv._.shift();
  const targetUri = "/" + argv._.join("/");

  // Create a Doplr instance
  const doplr = new Doplr({
    // Locate the nearest .forecast - If none is found, we'll create one where we are
    targetForecast: locateForecast(
        path.resolve(argv["forecast-path"].replace(CONSTANTS.DEFAULT_FORECAST_DIRECTORY, ""))
      ) || CONSTANTS.DEFAULT_FORECAST_DIRECTORY,
    verbose: argv.verbose,
    silent: argv.silent
  });
  log.info(`Forecast directory: ${doplr.forecastPath}`);

  // `doplr radar` Launch the API
  if (["r", "ra", "rad", "rada", "radar"].indexOf(chosenAction) > -1) {
    const radar = new doplr.Radar({
      weathergirl: !argv["no-weathergirl"]
    });
    radar.listen(argv["radar-port"]);

    // Pop the browser if we're hosting weathergirl
    if (!argv["no-weathergirl"] &&
    !argv.silent && // And we're not silent
    typeof argv["radar-port"] === "number" && // And radar is listening on a TCP port
    process.platform !== "linux") { // And we're not on linux (shrug)
      setTimeout(function () {
        const open = require("open");
        open("http://localhost:" + argv["radar-port"]);
      }, 100);
    }

  // `doplr sweep <type> <target> [options]`
  } else if (["s", "sw", "swe", "swee", "sweep"].indexOf(chosenAction) > -1) {

    const sweep = new doplr.Sweep({
      targetUri: targetUri
    });
    sweep.begin();

  // `doplr forecast <categoryOrKeyword> [options]`
  } else if (["f", "fo", "for", "fore", "forec",
              "foreca", "forecas", "forecast"].indexOf(chosenAction) > -1) {
    const forecast = new doplr.Forecast({
      targetUri: targetUri
    });
    forecast.report();

  } else {
    log(`No such action "${chosenAction}"\n\n`, yargs.help());
  }
}

"use strict";

const Doplr = require("./../lib");
const CONSTANTS = require("./../lib/constants");

const doplr = new Doplr({
  // Locate the nearest .forecast - If none is found, we'll create one where we are
  targetForecast: process.env.FOREAST_PATH || ".",
  verbose: process.env.VERBOSE || 0,
  silent: process.env.SILENT || false
});

const radar = new doplr.Radar({
  weathergirl: process.env.WEATHERGIRL
});
radar.listen(process.env.PORT || CONSTANTS.DEFAULT_RADARPORT);

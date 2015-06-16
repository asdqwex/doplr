#!/usr/bin/env node
'use strict';

const Doplr = require('doplr');
const CONSTANTS = Doplr.CONSTANTS;

const doplr = new Doplr({
  // Locate the nearest weather db - If none is found, we'll create one where we are
  targetDb: process.env.DB_PATH || '.',
  verbose: process.env.VERBOSE || 0,
  silent: process.env.SILENT || false
});

const radar = new doplr.Radar();

radar.listen(process.env.PORT || CONSTANTS.DEFAULT_RADARPORT);

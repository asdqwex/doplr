'use strict';

module.exports = {
  // The default string name of the database we'll create
  DEFAULT_DB_PATH: '.weather',
  // Default port that for radar
  DEFAULT_RADARPORT: 9040,
  // An error string when a function hasn't been written yet
  UNIMPLIMENTED: 'Not yet supported',
  NETWORK: 'network',
  AWS: 'aws',
  HOST: 'host',
  GOOGLE_CLOUD: 'gce',
  OPENSTACK: 'openstack',
  // Content caching length for radar HTTP
  ASSETS_MAX_AGE: 60 * 60 * 24 * 7
};

'use strict';

module.exports = function SweepFactory (helpers) {
  const CONSTANTS = helpers.CONSTANTS;
  class Sweep {

    constructor (options) {
      options = options || {};
      this.target = options.target || false;
      this.type = options.type || CONSTANTS.HOST;
      this.log = helpers.logger(options);

      this.plugins = {};
      // Initial plugins
      options.plugins = options.plugins || [
        'ping'
      ];

      for (const plugin of options.plugins) {
        this.use(plugin, `./../plugins/${plugin}`);
      }
    }

    // Loads a plugin
    use (name, path) {
      const self = this;
      if (path === undefined) {
        path = name;
      }
      if (this.plugins[name] !== undefined){
        return false;
      }
      try {
        this.plugins[name] = require(path);
      } catch (err) {
        self.log(`Unable to use plugin ${name}`);
        throw new Error(err);
      }
      return true;
    }

    begin () {
      // I ain't got no type...
      if (!this.type) {
        throw new Error('No sweep type defined');
      }

      // do things
      this.log.info(this.type, this.target);

      const Ping = this.plugins.ping;
      const ping = new Ping(this.target);
      ping.update();

    }
  }
  Sweep.types = {};
  Sweep.types[CONSTANTS.HOST] = require('./sweep/host');
  Sweep.types[CONSTANTS.NETWORK] = require('./sweep/network');
  return Sweep;
};

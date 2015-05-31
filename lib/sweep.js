"use strict";

const CONSTANTS = require("./constants");

module.exports = function DoplrSweepFactory (doplr) {

  return class DoplrSweep {

    constructor (options) {
      options = options || {};
      this.target = options.target || false;
      this.type = options.type || CONSTANTS.HOST;
      this.types = {};
      this.types[CONSTANTS.HOST] = require("./sweep/host");
      this.types[CONSTANTS.NETWORK] = require("./sweep/network");

      this.plugins = {};
      // Initial plugins
      options.plugins = options.plugins || [
        "latency"
      ];

      for (const plugin of options.plugins) {
        this.use(plugin, `./../plugins/${plugin}`);
      }
    }

    // Loads a plugin
    use (name, path) {
      if (path === undefined) {
        path = name;
      }
      if (this.plugins[name] !== undefined){
        return false;
      }
      try {
        this.plugins[name] = require(path);
      } catch (err) {
        doplr.log(`Unable to use plugin ${name}`);
        throw new Error(err);
      }
      return true;
    }

    begin () {
      // I ain't got no type...
      if (!this.type) {
        throw new Error("No sweep type defined");
      }
      if (this.types[this.type] === undefined) {
        doplr.log("No such sweep type");
        throw new Error("No such sweep type");
      }



    }
  };
};

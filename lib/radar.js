"use strict";

module.exports = function RadarFactory (doplr) {
  return class Radar {

    constructor () {
      // Don't require any deps until Radar has been instanciated
      // It means less run-time memory while doing any other operation, since the
      // RadarFactory is executed, but a Radar is not created.
      // This means Koa won't have been required!
      const koa = require("koa");

      this.app = koa();
      this.app.use(function *(){
        this.body = "Welcome to WeatherGirl, Doplr Radar's web interface";
      });
    }

    /**
     * Creates the TCP or Unix socket by passing to koa's .listen()
     */
    listen (portOrSocket) {
      if (typeof portOrSocket !== "string") {
        doplr.log(`Radar now operational at http://localhost:${portOrSocket}`);
      }
      this.app.listen(portOrSocket);
    }
  };
};

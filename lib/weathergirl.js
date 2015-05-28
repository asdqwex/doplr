"use strict";

module.exports = function WeatherGirlFactory () {
  //const doplr = this;

  return class WeatherGirl {

    constructor () {
      // Don't require any deps until WeatherGirl has been instanciated
      // The purpose is so that we can easily split WeatherGirl apart later on
      // Also, it means less run-time memory while doing any other operation, since the
      // WeatherGirlFactory is executed, but a WeatherGirl is not created.
      // This means Koa won't have been required!
      const koa = require("koa");

      this.app = koa();
      this.app.use(function *(){
        this.body = "WeatherGirl - The Pretty Web Interface for doplr";
      });
    }

    /**
     * Creates the TCP or Unix socket by passing to koa's .listen()
     */
    listen (portOrSocket) {
      this.app.listen(portOrSocket);
    }
  };
};

"use strict";

const Doplr = require("./../lib");
const fs = require("fs");

if (!fs.existsSync("tmp")) {
  fs.mkdirSync("tmp");
}

const doplr = new Doplr({
  targetForecast: "tmp/.forecast"
});

require("mocha");
require("should");

describe("doplr", function () {
  describe("forecast", function () {
    it("should have resolved a forecastPath", function () {
      doplr.forecastPath.should.be.type("string");
    });
    it("should be a function", function () {
      doplr.Forecast.should.be.type("function");
    });
  });
  describe("sweep", function () {
    it("should be a function", function () {
      doplr.Sweep.should.be.type("function");
    });
  });
  describe("radar", function () {
    it("should be a function", function () {
      doplr.Radar.should.be.type("function");
    });
  });

});

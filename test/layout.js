'use strict';

const Doplr = require('./../lib');
const fs = require('fs');

if (!fs.existsSync('tmp')) {
  fs.mkdirSync('tmp');
}

const doplr = new Doplr({
  targetForecast: 'tmp/.forecast'
});

require('mocha');
require('should');

describe('doplr', function () {
  let myForecast = {};
  describe('forecast', function () {
    it('should have resolved a forecastPath', function () {
      doplr.forecastPath.should.be.type('string');
    });
    it('should be a function', function () {
      doplr.Forecast.should.be.type('function');
    });
    it('should create without issue', function () {
      myForecast = new doplr.Forecast();
      myForecast.should.be.instanceof(doplr.Forecast);
    });
  });
  describe('sweep', function () {
    let mySweep = {};
    it('should be a function', function () {
      doplr.Sweep.should.be.type('function');
    });
    it('should create without issue', function () {
      mySweep = new doplr.Sweep();
      mySweep.should.be.instanceof(doplr.Sweep);
    });
    describe('.begin', function () {
      it('should be a function', function () {
        mySweep.begin.should.be.type('function');
      });
    });
    describe('.use', function () {
      it('should be a function', function () {
        mySweep.use.should.be.type('function');
      });
    });
  });
  describe('radar', function () {
    let myRadar = {};
    it('should be a function', function () {
      doplr.Radar.should.be.type('function');
    });
    it('should create without issue', function () {
      myRadar = new doplr.Radar();
      myRadar.should.be.instanceof(doplr.Radar);
    });
    describe('.listen', function () {
      it('should be a function', function () {
        myRadar.listen.should.be.type('function');
      });
    });
  });

});

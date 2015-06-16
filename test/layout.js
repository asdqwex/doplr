'use strict';

const Doplr = require('./../lib');
const fs = require('fs');

if (!fs.existsSync('tmp')) {
  fs.mkdirSync('tmp');
}

const targetForecast = 'tmp/.forecast';

require('mocha');
require('should');

describe('doplr', function () {
  let myForecast = {};
  describe('forecast', function () {
    it('should be a function', function () {
      Doplr.Forecast.should.be.type('function');
    });
    it('should create without issue', function () {
      myForecast = new Doplr.Forecast();
      myForecast.should.be.instanceof(Doplr.Forecast);
    });
  });
  describe('sweep', function () {
    let mySweep = {};
    it('should be a function', function () {
      Doplr.Sweep.should.be.type('function');
    });
    it('should create without issue', function () {
      mySweep = new Doplr.Sweep();
      mySweep.should.be.instanceof(Doplr.Sweep);
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
      Doplr.Radar.should.be.type('function');
    });
    it('should create without issue', function () {
      myRadar = new Doplr.Radar();
      myRadar.should.be.instanceof(Doplr.Radar);
    });
    describe('.listen', function () {
      it('should be a function', function () {
        myRadar.listen.should.be.type('function');
      });
    });
  });

});

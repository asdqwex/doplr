"use strict";

module.exports = function WeatherGirlFactory () {
  //const doplr = this;

  return class WeatherGirl {

    constructor () {

    }

    listen (port) {
      var koa = require('koa');
	  var app = koa();
	  
	  app.use(function *(){
	    this.body = 'WeatherGirl - The Pretty Web Interface for doplr ';
	  });
	  
	  app.listen(3000);

    }
  };
};

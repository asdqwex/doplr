'use strict';

const path = require('path');
const CONSTANTS = require('./../lib/constants');

module.exports = function RadarFactory (doplr) {
  return class Radar {

    constructor () {
      const koa = require('koa');
      const route = require('koa-route');
      const wares = require('koa-middlewares');

      this.http = koa();

      // Ignore favicon routes
      this.http.use(wares.favicon());

      // Middleware for logging / X-Response-Time header
      this.http.use(function *(next){
        var start = new Date();
        yield next;
        var ms = new Date() - start;
        this.set('X-Response-Time', ms + 'ms');
        doplr.log.debug('%s %s - %s', this.method, this.url, ms);
      });

      // Static assets
      this.http.use(wares.staticCache(path.join(__dirname, 'www'), {
        buffer: !process.env.DEVELOPMENT,
        maxAge: process.env.DEVELOPMENT ? 0 : CONSTANTS.ASSETS_MAX_AGE
      }));
      this.http.use(wares.bodyParser());

      // Routes
      this.http.use(route.get('/', this.appIndex));
      this.http.use(route.get('/forecast', this.forecast));
    }

    /**
     * Creates the TCP or Unix socket by passing to koa's .listen()
     */
    listen (portOrSocket) {
      if (typeof portOrSocket !== 'string') {
        doplr.log(`Radar now operational at http://localhost:${portOrSocket}`);
      }
      this.http.listen(portOrSocket);
    }

    /**
     * Serves the weathergirl index page
     */
    *appIndex () {

    }
  };
};

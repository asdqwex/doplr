'use strict';

module.exports = function RadarFactory (helpers) {
  return class Radar {

    constructor (options) {
      this.log = helpers.logger(options);
      const radar = this;
      const koa = require('koa');
      const route = require('koa-route');
      const koaFavicon = require('koa-favicon');
      const koaStatic = require('koa-static');
      const koaBodyParser = require('koa-bodyparser');

      this.http = koa();

      // Ignore favicon routes
      this.http.use(koaFavicon());

      // Middleware for logging / X-Response-Time header
      this.http.use(function *(next){
        var start = new Date();
        yield next;
        var ms = new Date() - start;
        this.set('X-Response-Time', ms + 'ms');
        radar.log.debug('%s %s - %s', this.method, this.url, ms);
      });

      // Views and assets
      this.http.use(koaStatic('public'));
      this.http.use(koaBodyParser());

      // Connect to lib/forecast.js here
      this.http.use(route.get('/forecast', this.forecast));
    }

    /**
     * Creates the TCP or Unix socket by passing to koa's .listen()
     */
    listen (portOrSocket) {
      if (typeof portOrSocket !== 'string') {
        this.log(`Radar is now operational at http://localhost:${portOrSocket}`);
      }
      this.http.listen(portOrSocket);
    }
  };
};

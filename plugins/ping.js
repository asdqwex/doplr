'use strict';

const spawn = require('child_process').spawn;

class Ping {
  constructor (host) {
    this.host = host;
    this.state = {
      latencies: []
    };
  }
  update () {
    const self = this;
    this.child = spawn('ping', ['-c 3', '-n', this.host]);

    let stdout = '', stderr = '';
    this.child.stdout.on('data', function (data) {
      stdout = stdout + data;
    });
    this.child.stderr.on('data', function (data) {
      stderr = stderr + data;
    });
    this.child.on('exit', function(exitCode) {
      if (exitCode === 2) {
        // report a timeout
      }
      // console.log(stdout);
      stdout = stdout.split('\n');
      for (let i = 1; i < 4; i++) {
        self.state.latencies.push(Number(
          stdout[i].split('=').pop().replace(' ms', ''))
        );
      }
      console.log(`(${self.host}) new state:`, self.state);
    });
  }
}

module.exports = Ping;

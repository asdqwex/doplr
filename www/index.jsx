'use strict';

const React = require('react');
const jQuery = require('jquery');

let hosts = [
  {
    id: 0,
    hostname: 'host1',
    facts: [],
    healthPct: 90
  },
  {
    id: 1,
    hostname: 'host2',
    facts: [],
    healthPct: 100
  },
  {
    id: 2,
    hostname: 'host3',
    facts: [],
    healthPct: 80
  }
];

let events = [
  {
    some: 'facts',
    go: 'here'
  }, {
    // this event involves some hosts
    involves: [ 1, 2 ]
  }
];

const helpers = {
  healthColor: function (health) {
    let color = 'red';
    if (health > 80) {
      color = 'green';
    } else if (health > 50) {
      color = 'orange';
    }
    return color;
  }
};

const HostSearchPane = require('./partials/hostSearchPane.jsx')(React, helpers);
React.render(
  <HostSearchPane hostData={hosts} />,
  document.getElementById('hostSearchPane')
);

const Mainmenu = require('./partials/mainmenu.jsx')(React, helpers);
React.render(
  <Mainmenu hostData={hosts} eventData={events} />,
  document.getElementById('mainmenu')
);

const d3 = require('d3');
const svg = d3.select('svg');

var circle = svg.selectAll('circle')
  .data(hosts.map(function (host){
    return host.healthPct;
  }));

var circleEnter = circle.enter().append('circle');

circleEnter.style('fill', 'steelblue');
circleEnter.attr('cy', 60);
circleEnter.attr('cx', function(d, i) { return i * 100 + 300; });
circleEnter.attr('r', function(d) { return d / 2; });

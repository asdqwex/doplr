/* global d3 */
'use strict';

const React = require('react');
const jQuery = require('jquery');

let hosts = [
  {
    id: 0,
    hostname: 'host1',
    facts: [],
    healthPct: 70
  },
  {
    id: 1,
    hostname: 'host2',
    facts: [],
    healthPct: 100
  },
  {
    id: 3,
    hostname: 'host3',
    facts: [],
    healthPct: 50
  }
];

const HostSearchPane = require('./partials/hostSearchPane.jsx')(React);
React.render(<HostSearchPane data={hosts} />, document.getElementById('hostSearchPane'));

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

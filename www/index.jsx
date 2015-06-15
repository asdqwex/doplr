'use strict';

const React = require('react');

const Hello = React.createClass({
    render: function() {
        return <div>Hello {this.props.name}</div>;
    }
});

//React.render(<Hello name="World2" />, document.getElementById('container'));

const svg = d3.select('svg');

var circle = svg.selectAll('circle')
    .data([32, 57, 112, 293]);

var circleEnter = circle.enter().append('circle');

circleEnter.style("fill", "steelblue");
circleEnter.attr("cy", 60);
circleEnter.attr("cx", function(d, i) { return i * 100 + 300; });
circleEnter.attr("r", function(d) { return Math.sqrt(d); });

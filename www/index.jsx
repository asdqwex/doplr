'use strict';

const React = require('react');

const Hello = React.createClass({
    render: function() {
        return <div>Hello {this.props.name}</div>;
    }
});

React.render(<Hello name="World2" />, document.getElementById('container'));

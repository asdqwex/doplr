'use strict';

module.exports = function (React, helpers) {
  const Mainmenu = React.createClass({
    render: function() {
      const hosts = this.props.hostData;
      const events = this.props.eventData;
      const healthColor = helpers.healthColor;
      let overallHealth = Math.round(
        hosts.map(function (host) {
          return host.healthPct || 0;
        }).reduce(function (p, c) {
          return p + c;
        }) / hosts.length
      );
      const healthClassString = 'ui ' + healthColor(overallHealth) + ' label';
      return (
        <div className="mainmenu container">
          <a className="item title">Doplr Radar</a>
          <a className="item">
            <i className="find icon"></i>
            <span>Sweep</span>
          </a>
          <a className="item">
            <i className="rain icon"></i>
            <span>Forecast</span>
            <div className={ healthClassString }>
              { overallHealth }%
            </div>
          </a>
          <a className="item">
            <i className="cubes icon"></i>
            <span>Hosts</span>
            <div className="ui label">{ hosts.length }</div>
          </a>
          <a className="item">
            <i className="announcement icon"></i>
            <span>Events</span>
            <div className="ui label">{ events.length }</div>
          </a>
          <a className="right item">
            <i className="options icon"></i>
            <span>Settings</span>
          </a>
        </div>
      );
    }
  });
  return Mainmenu;
};

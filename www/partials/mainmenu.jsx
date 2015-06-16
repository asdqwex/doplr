'use strict';

module.exports = function (React) {
  const Mainmenu = React.createClass({
    render: function() {
      const hosts = this.props.hostData;
      const events = this.props.eventData;
      let overallHealth = Math.round(
        hosts.map(function (host) {
          return host.healthPct || 0;
        }).reduce(function (p, c) {
          return p + c;
        }) / hosts.length
      );
      function healthColor(health) {
        let color = 'red';
        if (health > 80) {
          color = 'green';
        } else if (health > 50) {
          color = 'orange';
        }
        return color;
      }
      const healthClassString = 'ui ' + healthColor(overallHealth) + ' label';
      return (
        <div className="mainmenu ui fixed inverted blue main menu">
          <div className="container">
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
        </div>
      );
    }
  });
  return Mainmenu;
};

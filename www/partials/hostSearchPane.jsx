'use strict';
module.exports = function (React, helpers) {
  const HostSearchPaneItem = React.createClass({
    render: function() {
      const hostData = this.props.hostData;
      const healthColor = helpers.healthColor;
      const healthClassString = 'ui ' + healthColor(hostData.healthPct) + ' label';
      return (
        <a className="hostSearchPaneItem item">
          { hostData.hostname || 'no name' }
          <div className={healthClassString}>{ hostData.healthPct }</div>
        </a>
      );
    }
  });
  const HostSearchPane = React.createClass({
    render: function() {
      const hostNodes = this.props.hostData.map(function (host) {
        return (
          <HostSearchPaneItem key={host.id} hostData={host}></HostSearchPaneItem>
        );
      });
      return (
        <div className="hostSearchPane ui vertical side menu">
          <a className="item">
            <div className="ui transparent icon input">
              <input type="text" placeholder="Search hosts">
                <i className="search icon"></i>
              </input>
            </div>
          </a>
          {hostNodes}
        </div>
      );
    }
  });
  return HostSearchPane;
};

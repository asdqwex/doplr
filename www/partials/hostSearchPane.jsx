'use strict';
module.exports = function (React) {
  const HostSearchPaneItem = React.createClass({
    render: function() {
      const data = this.props.data;
      return (
        <a className="hostSearchPaneItem item">
          { data.hostname }
          <div className="ui label">{ data.healthPct }</div>
        </a>
      );
    }
  });
  const HostSearchPane = React.createClass({
    render: function() {
      const hostNodes = this.props.data.map(function (host) {
        return (
          <HostSearchPaneItem key={host.id} data={host}></HostSearchPaneItem>
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

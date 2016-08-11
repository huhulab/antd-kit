import React from 'react';

var PageIntro = React.createClass({
  render() {
    return (
      <div className="page-intro">
        <div className="lead">{ this.props.children }</div>
      </div>
    );
  }
});

export default PageIntro;

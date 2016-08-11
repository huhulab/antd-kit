import React from 'react';
import {Breadcrumb} from 'antd';

const Topbar = React.createClass({
  render() {
    const breadcrumb = this.props.breadcrumb.map(function(item) {
      return (
        <Breadcrumb.Item key={item} href=""> { item } </Breadcrumb.Item>
      )
    })
    return (
      <div className="topbar">
        <Breadcrumb>
          <Breadcrumb.Item href="">
            <i className="anticon anticon-home"></i>
          </Breadcrumb.Item>
          { breadcrumb }
        </Breadcrumb>
      </div>
    );
  }
});

export default Topbar;

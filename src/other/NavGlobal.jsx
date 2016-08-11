
import React from 'react';
import { Link } from 'react-router';
import cookie from 'react-cookie';
import { Menu, Dropdown } from 'antd';

import { siteTitle } from 'data/config';


export default React.createClass({
  displayName: 'NavGlobal',

  componentWillReceiveProps(newProps) {
    this.setState({});
  },

  render() {
    const topMenu = this.props.topMenu;
    let menu = (
      <Menu>
        {
          topMenu.map(function(menu) {
            if (menu.divider) {
              return (<Menu.Divider key={menu.key}/>);
            } else {
              return (
                <Menu.Item key={menu.key}>
                  <a href={"#" + menu.href} onClick={menu.onClick}>
                    <i className={menu.iconClass}></i> {menu.label}
                  </a>
                </Menu.Item>
              );
            }
          })
        }
      </Menu>
    );

    const user = this.props.user;
    const userName = user ? user.login : '';
    const descr = user ? user.type : '';
    return (
      <div className="nav-global">
        <div>
          <div className="global-logo">
            <div style={{padding: '10px', display: 'inline'}}>
              <a href="#"><h2 style={{textAlign: 'center', color: '#FAFAFA'}} >{siteTitle}</h2></a>
            </div>
          </div>
          <div className="items-inner">
            <ul className="global-items">
              <li className="nav-item">
                <Dropdown overlay={menu}>
                  <a className="nav-item-inner">
                    <span className="fa fa-ios-app"></span>
                    <span className="nav-text ios" >
                      {userName} &nbsp;
                      <small style={{color: '#aaa'}}>({descr})</small>
                    </span>
                  </a>
                </Dropdown>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

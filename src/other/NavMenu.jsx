import React from 'react';
import { Menu } from 'antd';
import { History } from 'react-router';

const SubMenu = Menu.SubMenu;

const NavMenu = React.createClass({
  displayName: 'NavMenu',
  mixins: [History],
  getInitialState() {
    return {
      current: '1'
    }
  },
  handleMenuItemClick(to) {
    console.log('handleMenuItemClick', to);
    /* this.history.pushState(null, to); */
  },
  handleClick(e) {
    console.log('click ', e);
    this.setState({
      current: e.key
    });
    if (e.key && e.key.length > 0 && e.key[0] == '/') {
      this.history.pushState(null, e.key);
    }
  },


  render() {
    const sideMenu = this.props.sideMenu;
    const sideMenuItems = sideMenu.menus.map(function(menu) {
      const menuTitle = (
        <span>
          <i className={menu.title.iconClass}></i>
          <span> {menu.title.label}</span>
        </span>
      );

      if ('children' in menu) {
        return (
          <SubMenu key={menu.key} title={menuTitle}>
            {
              menu.children.map(function(menu){
              return <Menu.Item key={menu.key}>{menu.label}</Menu.Item>;
              })
            }
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={menu.key}>
            {menuTitle} {menu.label}
          </Menu.Item>
        );
      }
    });

    let menu = (
      <Menu theme="dark"
            onClick={this.handleClick}
            style={{width:200}}
            defaultOpenKeys={sideMenu.defaultOpenKeys}
            selectedKeys={[this.state.current]}
            mode="inline">
        {sideMenuItems}
      </Menu>);

    return (
      <div className="nav-menu">
        <div className="nav-menu-inner">
          <div className="menu-items">
            {menu}
          </div>
        </div>
      </div>
    );
  }
});

export default NavMenu;

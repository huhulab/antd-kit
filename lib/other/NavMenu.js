'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SubMenu = _antd.Menu.SubMenu;

var NavMenu = _react2.default.createClass({
  displayName: 'NavMenu',
  mixins: [_reactRouter.History],
  getInitialState: function getInitialState() {
    return {
      current: '1'
    };
  },
  handleMenuItemClick: function handleMenuItemClick(to) {
    console.log('handleMenuItemClick', to);
    /* this.history.pushState(null, to); */
  },
  handleClick: function handleClick(e) {
    console.log('click ', e);
    this.setState({
      current: e.key
    });
    if (e.key && e.key.length > 0 && e.key[0] == '/') {
      this.history.pushState(null, e.key);
    }
  },
  render: function render() {
    var sideMenu = this.props.sideMenu;
    var sideMenuItems = sideMenu.menus.map(function (menu) {
      var menuTitle = _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement('i', { className: menu.title.iconClass }),
        _react2.default.createElement(
          'span',
          null,
          ' ',
          menu.title.label
        )
      );

      if ('children' in menu) {
        return _react2.default.createElement(
          SubMenu,
          { key: menu.key, title: menuTitle },
          menu.children.map(function (menu) {
            return _react2.default.createElement(
              _antd.Menu.Item,
              { key: menu.key },
              menu.label
            );
          })
        );
      } else {
        return _react2.default.createElement(
          _antd.Menu.Item,
          { key: menu.key },
          menuTitle,
          ' ',
          menu.label
        );
      }
    });

    var menu = _react2.default.createElement(
      _antd.Menu,
      { theme: 'dark',
        onClick: this.handleClick,
        style: { width: 200 },
        defaultOpenKeys: sideMenu.defaultOpenKeys,
        selectedKeys: [this.state.current],
        mode: 'inline' },
      sideMenuItems
    );

    return _react2.default.createElement(
      'div',
      { className: 'nav-menu' },
      _react2.default.createElement(
        'div',
        { className: 'nav-menu-inner' },
        _react2.default.createElement(
          'div',
          { className: 'menu-items' },
          menu
        )
      )
    );
  }
});

exports.default = NavMenu;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reactCookie = require('react-cookie');

var _reactCookie2 = _interopRequireDefault(_reactCookie);

var _antd = require('antd');

var _config = require('data/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'NavGlobal',

  componentWillReceiveProps: function componentWillReceiveProps(newProps) {
    this.setState({});
  },
  render: function render() {
    var topMenu = this.props.topMenu;
    var menu = _react2.default.createElement(
      _antd.Menu,
      null,
      topMenu.map(function (menu) {
        if (menu.divider) {
          return _react2.default.createElement(_antd.Menu.Divider, { key: menu.key });
        } else {
          return _react2.default.createElement(
            _antd.Menu.Item,
            { key: menu.key },
            _react2.default.createElement(
              'a',
              { href: "#" + menu.href, onClick: menu.onClick },
              _react2.default.createElement('i', { className: menu.iconClass }),
              ' ',
              menu.label
            )
          );
        }
      })
    );

    var user = this.props.user;
    var userName = user ? user.login : '';
    var descr = user ? user.type : '';
    return _react2.default.createElement(
      'div',
      { className: 'nav-global' },
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'global-logo' },
          _react2.default.createElement(
            'div',
            { style: { padding: '10px', display: 'inline' } },
            _react2.default.createElement(
              'a',
              { href: '#' },
              _react2.default.createElement(
                'h2',
                { style: { textAlign: 'center', color: '#FAFAFA' } },
                _config.siteTitle
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'items-inner' },
          _react2.default.createElement(
            'ul',
            { className: 'global-items' },
            _react2.default.createElement(
              'li',
              { className: 'nav-item' },
              _react2.default.createElement(
                _antd.Dropdown,
                { overlay: menu },
                _react2.default.createElement(
                  'a',
                  { className: 'nav-item-inner' },
                  _react2.default.createElement('span', { className: 'fa fa-ios-app' }),
                  _react2.default.createElement(
                    'span',
                    { className: 'nav-text ios' },
                    userName,
                    '  ',
                    _react2.default.createElement(
                      'small',
                      { style: { color: '#aaa' } },
                      '(',
                      descr,
                      ')'
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }
});
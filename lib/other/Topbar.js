'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Topbar = _react2.default.createClass({
  displayName: 'Topbar',
  render: function render() {
    var breadcrumb = this.props.breadcrumb.map(function (item) {
      return _react2.default.createElement(
        _antd.Breadcrumb.Item,
        { key: item, href: '' },
        ' ',
        item,
        ' '
      );
    });
    return _react2.default.createElement(
      'div',
      { className: 'topbar' },
      _react2.default.createElement(
        _antd.Breadcrumb,
        null,
        _react2.default.createElement(
          _antd.Breadcrumb.Item,
          { href: '' },
          _react2.default.createElement('i', { className: 'anticon anticon-home' })
        ),
        breadcrumb
      )
    );
  }
});

exports.default = Topbar;
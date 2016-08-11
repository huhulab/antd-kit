'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableMixin = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

var _api = require('data/api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Re design use reuseable component:
    > https://facebook.github.io/react/docs/reusable-components.html
 */

var Option = _antd.Select.Option;

var Integer = Number;
var FilterConfig = {
  names: [String, String, String],
  items: {
    name: {
      attrs: undefined || {
        width: '120px',
        marginRight: '3px',
        display: 'inline-block'
      },
      typeClass: undefined || Object, // Default: InputClass || SelectClass
      optionClass: undefined || Object, // Default: OptionClass
      options: undefined || Array, // For: Select, Radio
      render: undefined || Function
    }
  }
};

var ColumnNames = [String, String, String] || {
  name: [String, String, String],
  name2: [String, String, String]
};

var Columns = {
  name: {
    title: String,
    dataIndex: String,
    OTHER: undefined
  },
  name2: {}
};

var TableMixin = exports.TableMixin = {
  getBaseState: function getBaseState(Model, columns, columnNames, defaultQuery) {
    var query = defaultQuery === undefined ? new _api.ApiQuery(1, 20, [], []) : defaultQuery;

    Object.keys(columns).forEach(function (name) {
      if (columns[name].dataIndex === undefined) {
        columns[name].dataIndex = name;
      }
    });

    return {
      loading: false,
      Model: Model,
      columns: columns,
      columnNames: columnNames,
      /* filterConfig: filterConfig, */
      selectedRows: [],
      query: query,
      total: 0,
      objects: []
    };
  },


  //// For table attributes
  //////////////////////////////////////////////////
  rowKey: function rowKey(record) {
    return String(record.id);
  },
  expandedRowRender: function expandedRowRender(record) {
    var _this = this;

    var handleUpdateClick = function handleUpdateClick(e) {
      _this.handleUpdateClick(record);
    };
    var btnStyle = { float: 'left' };
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        _antd.Button,
        { style: btnStyle, type: 'primary', onClick: handleUpdateClick },
        '编辑'
      )
    );
  },


  //// Use in `render()`
  //////////////////////////////////////////////////
  handleModalDismiss: function handleModalDismiss(e, name) {
    var newState = {};
    newState[name] = false;
    this.setState(newState);
  },
  getColumns: function getColumns(key) {
    var _this2 = this;

    var columnNames = this.state.columnNames;
    console.log('getColumns.columnNames:', key, columnNames);
    var fields = columnNames.constructor === Array ? columnNames : columnNames[key];
    return fields.map(function (field) {
      return _this2.state.columns[field];
    });
  },
  getPagination: function getPagination() {
    var query = this.state.query;
    return {
      current: query.page,
      pageSize: query.perpage,
      total: this.state.total
    };
  },
  getRowSelection: function getRowSelection() {
    var _this3 = this;

    return {
      onSelect: function onSelect(record, selected, selectedRows) {
        console.log('onSelect:', record, selected, selectedRows);
        _this3.setState({ selectedRows: selectedRows });
      },
      onSelectAll: function onSelectAll(selected, selectedRows) {
        console.log('onSelectAll:', selected, selectedRows);
        _this3.setState({ selectedRows: selectedRows });
      }
    };
  },


  //// Table logic
  _loadData: function _loadData(okCallback, errorCallback) {
    var query = this.state.query;
    this.state.Model.objects(query).then(function (resp) {
      okCallback(resp.data);
    }).catch(function (resp) {
      errorCallback(resp);
    });
  },
  loadPage: function loadPage(e) {
    var _this4 = this;

    this.setState({ loading: true }, function () {
      var loadDataFunc = _this4.loadData === undefined ? _this4._loadData : _this4.loadData;
      loadDataFunc(function (data) {
        /// Success callback
        _this4.setState({
          loading: false,
          total: data.total,
          objects: data.objects
        });
        if (e !== undefined) {
          _antd.message.success('刷新成功', 1);
        }
      }, function (resp) {
        console.log('Error response:', resp);
        /// Error callback
        if (resp.status == 400) {
          _this4.setState({ loading: false }, function () {
            var query = _this4.state.query;
            query.page = 1;
            _this4.setState({ query: query }, function () {
              _this4.loadPage();
            });
          });
        } else {
          _antd.message.error('加载失败: ' + resp.data.message);
        }
      });
    });
  },
  onTableChanged: function onTableChanged(pagination, filters, sorter) {
    var _this5 = this;

    console.log('onTableChanged', pagination, filters, sorter);
    var query = this.state.query;
    var sort = this.state.sort;
    if (Object.keys(sorter).length > 0) {
      var theOrder = {
        'ascend': 'asc',
        'descend': 'desc'
      }[sorter.order];
      sort = [[sorter.field, theOrder]];
    }
    query.page = pagination.current;
    query.perpage = pagination.pageSize;
    query.sort = sort;
    this.setState({ query: query }, function () {
      _this5.loadPage();
    });
  }
};
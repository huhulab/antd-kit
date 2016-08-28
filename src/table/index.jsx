import React from 'react';
import {Table, Tabs, Button, message, Select} from 'antd';

import { ApiQuery } from 'data/api';

/* Re design use reuseable component:
    > https://facebook.github.io/react/docs/reusable-components.html
 */

const Option = Select.Option;

const Integer = Number;
const FilterConfig = {
  names: [String, String, String],
  items: {
    name: {
      attrs: undefined || {
        width: '120px',
        marginRight: '3px',
        display: 'inline-block',
      },
      typeClass: undefined || Object, // Default: InputClass || SelectClass
      optionClass: undefined || Object, // Default: OptionClass
      options: undefined || Array, // For: Select, Radio
      render: undefined || Function,
    },
  }
};

const ColumnNames = [String, String, String] || {
  name: [String, String, String],
  name2: [String, String, String],
};

const Columns = {
  name: {
    title: String,
    dataIndex: String,
    OTHER: undefined,
  },
  name2: {},
}


export const TableMixin = {

  getBaseState(Model, columns, columnNames, defaultQuery) {
    const query = defaultQuery === undefined ? new ApiQuery(1, 20, [], []) : defaultQuery;

    Object.keys(columns).forEach(function(name) {
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
      objects: [],
    };
  },

  //// For table attributes
  //////////////////////////////////////////////////
  rowKey(record) {
    return String(record.id);
  },

  expandedRowRender(record) {
    const handleUpdateClick = (e) => {
      this.handleUpdateClick(record);
    };
    const btnStyle = {float: 'left'};
    return (
      <div>
        <Button style={btnStyle} type="primary" onClick={handleUpdateClick}>编辑</Button>
      </div>);
  },

  //// Use in `render()`
  //////////////////////////////////////////////////
  handleModalDismiss(e, name) {
    const newState = {};
    newState[name] = false;
    this.setState(newState);
  },

  getColumns(key) {
    const columnNames = this.state.columnNames;
    // console.log('getColumns.columnNames:', key, columnNames);
    const fields = columnNames.constructor === Array ? columnNames : columnNames[key];
    return fields.map((field) => {
      return this.state.columns[field];
    });
  },

  getPagination() {
    const query = this.state.query;
    return {
      current: query.page,
      pageSize: query.perpage,
      total: this.state.total,
    };
  },

  getRowSelection() {
    return {
      onSelect: (record, selected, selectedRows) => {
        console.log('onSelect:', record, selected, selectedRows);
        this.setState({selectedRows: selectedRows});
      },
      onSelectAll: (selected, selectedRows) => {
        console.log('onSelectAll:', selected, selectedRows);
        this.setState({selectedRows: selectedRows});
      }
    }
  },

  //// Table logic
  _loadData(okCallback, errorCallback) {
    const query = this.state.query;
    this.state.Model.objects(query).then((resp) => {
      okCallback(resp.data);
    }).catch((resp) => {
      errorCallback(resp);
    });
  },

  loadPage(e) {
    this.setState({loading: true}, () => {
      const loadDataFunc = this.loadData === undefined ? this._loadData : this.loadData;
      loadDataFunc((data) => {
        /// Success callback
        this.setState({
          loading: false,
          total: data.total,
          objects: data.objects
        });
        if (e !== undefined) {
          message.success('刷新成功', 1);
        }
      }, (resp) => {
        console.log('Error response:', resp);
        /// Error callback
        if (resp.status == 400) {
          this.setState({loading: false}, () => {
            let query = this.state.query;
            query.page = 1;
            this.setState({query: query}, () => {
              this.loadPage();
            });
          });
        } else {
          message.error(`加载失败: ${resp.data.message}`);
        }
      });
    });
  },

  onTableChanged(pagination, filters, sorter){
    console.log('onTableChanged', pagination, filters, sorter);
    let query = this.state.query;
    let sort = this.state.sort;
    if (Object.keys(sorter).length > 0) {
      const theOrder = {
        'ascend': 'asc',
        'descend': 'desc',
      }[sorter.order];
      sort = [[sorter.field, theOrder]];
    }
    query.page = pagination.current;
    query.perpage = pagination.pageSize;
    query.sort = sort;
    this.setState({query: query}, () => {
      this.loadPage();
    });
  },

};

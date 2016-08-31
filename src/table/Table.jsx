import React, { Component, PropTypes } from 'react';
import {
  Table, Button, Modal, Row, Col, message, Popconfirm
} from 'antd';
import {
  httpGet, httpDelete, httpErrorCallback, PageQuery
} from '../api';


const Action = String || {
  type: String, // (required): Table: ["create", "refresh", "export", "search", "delete-all"], Row: ["update", "delete"]
  element: Function || // Table: bind(this)(), Row: bind(this)(object)
  {
    label: String,
    onClick: Function, // Table: bind(this)(event), Row: bind(this)(event, object)
    props: Object, // Button props
  },
  Form: Object,   // ["search"]
  FormModal: Object,  // hiddenElements: ["create", "update"]
  formProps: undefined || Object || Function,
};

const TableActions = [Action, Action, Action];

const PageLoader = Promise;

const ActionColumn = [Action, Action, Action] || {
  title: String,
  key: String,
  width: Integer,
  actions: [Action, Action, Action]
};


const HiddenForm = {
  name: String,
  Form: Object,
  props: undefined || Object || Function,
}


class BaseTable extends Component {
  static propTypes = {
    innerProps: PropTypes.object.isRequired,
    pageLoader: PropTypes.func,
    urlPath: PropTypes.string.isRequired,
    pagination: PropTypes.bool,
    hiddenForms: PropTypes.array,
    tableActions: PropTypes.array,
    actionColumn: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    perpage: PropTypes.number,
    filters: PropTypes.array,
    sort: PropTypes.array,
  }

  static defaultProps = {
    pageLoader: function() {
      const query = this.state.query.toDict();
      return httpGet(this.props.urlPath, {
        params: {q: JSON.stringify(query)}
      });
    },
    pagination: true,
    hiddenForms: [],
    tableActions: [],
    perpage: 20,
    filters: [],
    sort: [],
  }

  constructor(props) {
    super(props);

    const page = 1;
    const { perpage, filters, sort, tableActions, actionColumn, hiddenForms } = props;
    let state = {
      updateObject: {},
      loading: false,
      total: 0,
      objects: [],
      query: new PageQuery({page, perpage, filters, sort}),
      selectedRows: [],
    };

    const rowActions = _.isArray(actionColumn) ? actionColumn : actionColumn.actions;
    tableActions.concat(rowActions).forEach(function(action) {
      if (!_.isString(action) && (action.Form !== undefined || action.FormModal !== undefined)) {
        state[`${action.type}Visible`] = false;
      }
    });
    hiddenForms.forEach(function(item) {
      state[`${item.name}Visible`] = false;
      state[`${item.name}Object`] = {};
    });
    this.state = state;
  }

  componentDidMount() {
    this.loadPage();
  }

  loadPage(e) {
    this.setState({loading: true}, ()=> {
      this.props.pageLoader.bind(this)().then((resp) => {
        console.log('loadPage success:', resp);
        this.setState({
          loading: false,
          total: resp.data.total,
          objects: resp.data.objects
        });
        if (e !== undefined) {
          message.success('刷新成功', 1);
        }
      }).catch((resp) => {
        console.log('loadPage error:', resp);
        this.setState({loading: false}, () => {
          if (resp.status === 400) {
            let query = this.state.query;
            query.page = 1;
            this.setState({query: query}, () => {
              this.loadPage();
            });
          } else {
            let error = resp.status === 500 ? "服务器内部错误" : "未知原因";
            if (resp.data === undefined) {
              error = resp;
            } else if (resp.data.message === undefined && resp.data !== "") {
              error = resp.data;
            } else if (resp.data.message !== "") {
              error = resp.data.message;
            }
            message.error(`加载失败: ${error}`);
          }
        });
      });
    });
  }

  rowKey(obj) {
    return String(obj.id);
  }

  onTableChanged(pagination, filters, sorter){
    console.log('onTableChanged', pagination, filters, sorter);
    let { query } = this.state;
    let sort = [];
    if (Object.keys(sorter).length > 0) {
      sort = [[
        sorter.field,
        {'ascend': 'asc', 'descend': 'desc'}[sorter.order]
      ]];
    }
    query.page = pagination.current;
    query.perpage = pagination.pageSize;
    query.sort = sort;
    this.setState({query: query}, () => {
      this.loadPage();
    });
  }

  render() {
    const { query } = this.state;
    const { innerProps, urlPath, pagination,
            actionColumn, tableActions, hiddenForms } = this.props;
    const { columns, expandedRowRender } = innerProps;

    // [static]
    const theExpandedRowRender = expandedRowRender === undefined ? undefined : expandedRowRender.bind(this);
    const thePagination = pagination ? {
      current: query.page,
      pageSize: query.perpage,
      total: this.state.total,
    } : false;

    // [static]
    let theRowSelection = null;
    tableActions.forEach((action) => {
      if (action === "delete-all" || action.type === "delete-all") {
        theRowSelection = {
          onSelect: (record, selected, selectedRows) => {
            // console.log('onSelect:', record, selected, selectedRows);
            this.setState({selectedRows: selectedRows});
          },
          onSelectAll: (selected, selectedRows) => {
            // console.log('onSelectAll:', selected, selectedRows);
            this.setState({selectedRows: selectedRows});
          },
        };
      }
    })

    let hiddenElements = [];

    // [static]
    hiddenForms.map((item) => {
      const visibleKey = `${item.name}Visible`;
      const objectKey = `${item.name}Object`;
      const props = _.isFunction(item.props) ? item.props.bind(this)() : _.get(item, "props", {});
      if (item.title !== undefined) {
        props.title = item.title;
      }
      let hideState = {};
      hideState[visibleKey] = false;
      const form = React.createElement(item.Form, {
        key: item.name,
        visible: this.state[visibleKey],
        object: this.state[objectKey],
        onCancel: () => this.setState(hideState),
        ...props
      });
      hiddenElements.push(form);
    });

    // [static]
    let theColumns = columns.map(function(column) {
      return {key: column.dataIndex, ...column};
    });

    if (actionColumn !== undefined) {
      const rowActions = _.isArray(actionColumn) ? actionColumn : actionColumn.actions;
      rowActions.forEach((action) => {
        const actionType = _.isString(action) ? action : action.type;
        if (actionType === "update") {
          const visibleKey = `${actionType}Visible`;
          const formProps = _.isFunction(action.formProps) ? action.formProps.bind(this)() : _.get(action, "formProps", {});
          let hideState = {};
          hideState[visibleKey] = false;
          hiddenElements.push(React.createElement(action.FormModal, {
            key: actionType,
            visible: this.state[visibleKey],
            object: this.state.updateObject,
            onSuccess: () => this.loadPage(),
            onCancel: () => this.setState(hideState),
            ...formProps
          }));
        }
      });

      const render = (object) => {
        const actions = rowActions.map((action) => {
          const actionType = _.isString(action) ? action : action.type;
          if (actionType === "update") {
            const handleUpdate = (e) => {
              console.log('handleUpdate:', object);
              let newState = {};
              newState[`${actionType}Object`] = object;
              newState[`${actionType}Visible`] = true;
              this.setState(newState);
            };
            return <Button key="update" onClick={handleUpdate} className="list-btn" type="primary" size="small">更新</Button>;
          } else if (actionType === "delete") {
            const handleDelete = (e) => {
              console.log('delete:', object.id);
              httpDelete(`${urlPath}${object.id}`).then((resp) => {
                message.success('删除成功!', 0.5);
                this.loadPage();
              }).catch(httpErrorCallback);
            };
            return <Popconfirm key="delete" placement="left" title={`确定要删除吗?`} onConfirm={handleDelete}>
              <Button size="small">删除</Button>
            </Popconfirm>;
          } else {
            console.error("Unknown row operation action:", action);
          }
        });
        return <div>{actions}</div>;
      }

      theColumns.push({
        title: _.get(actionColumn, "title", "操作"),
        key: _.get(actionColumn, "key", "operations"),
        width: _.get(actionColumn, "width", 60 * rowActions.length),
        render: render
      });
    }

    // [static]
    let searchForm = null;
    const toolbarElements = tableActions.map((action) => {
      if (_.isFunction(action)) {
        const { button, form } = action.bind(this)();
        return { button, form };
      }

      const isSimple = _.isString(action);
      const actionType = isSimple ? action : action.type;
      let showState = {};
      let hideState = {};
      const visibleKey = `${actionType}Visible`;
      showState[visibleKey] = true;
      hideState[visibleKey] = false;
      const formProps = _.isFunction(action.formProps) ? action.formProps.bind(this)() : _.get(action, "formProps", {});

      if (actionType === "refresh") {
        const defaultOnClick = (e) => this.loadPage(e);
        return isSimple ? (() => {
          return <Button key={actionType} onClick={defaultOnClick}
          type="primary" className="list-btn" >刷新</Button>;
        })() : (() => {
          const handleRefresh = action.onClick === undefined ? defaultOnClick : action.onClick.bind(this);
          const label = _.get(action, "label", "刷新");
          const buttonProps = _.get(action, "buttonProps", {});
          <Button key={actionType} type="primary" className="list-btn"
           {...buttonProps} onClick={handleRefresh}>{label}</Button>
        })();
      } else if (actionType === "create") {
        const modal = React.createElement(action.FormModal, {
          key: actionType,
          visible: this.state[visibleKey],
          onSuccess: () => this.loadPage(),
          onCancel: () => this.setState(hideState),
          ...formProps
        });
        hiddenElements.push(modal);
        const label = _.get(action, "label", "添加");
        return <Button key={actionType} type="primary" className="list-btn"
                       onClick={() => this.setState(showState)}>{label}</Button>;
      } else if (actionType === "search") {
        searchForm = React.createElement(action.Form, {
          key: actionType,
          visible: this.state[visibleKey],
          table: this,
          ...formProps
        });
        const label = _.get(action, "label", "搜索");
        const newState = this.state[visibleKey] ? hideState : showState;
        return <Button key={actionType} type="ghost"
                       onClick={(e) => {this.setState(newState)}}>{label}</Button>
      } else {
        console.error("Invalid tableAction:", action);
      }
    });

    // [static]
    const theToolbar = tableActions.length > 0 ? (
      <div className="toolbar">
        <div>{toolbarElements}</div>
        { searchForm === null ? null: <div>{searchForm}</div> }
      </div>
    ) : null;

    return (
      <div>
        {hiddenElements}
        {theToolbar}
        <Table
            bordered={true}
            rowKey={this.rowKey}
            pagination={thePagination}
            rowSelection={theRowSelection}
            {...innerProps}
            columns={theColumns}
            expandedRowRender={theExpandedRowRender}
            onChange={this.onTableChanged}
            loading={this.state.loading}
            dataSource={this.state.objects} />
      </div>
    );
  }
}

export { BaseTable };

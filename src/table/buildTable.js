import React from 'react';

import {httpDelete, httpErrorCallback} from './index';
import {Button, Popconfirm, message} from 'antd';

export function renderTableOperations({table, keyObject, keyShowForm, urlPath, others}) {
  return (object) => {
    const handleUpdate = (e) => {
      console.log('handleUpdate:', object);
      let newState = {};
      newState[keyObject] = object;
      newState[keyShowForm] = true;
      table.setState(newState);
    };
    const handleDelete = (e) => {
      console.log('delete:', object.id);
      httpDelete(`${urlPath}${object.id}`).then((resp) => {
        message.success('删除成功!', 0.5);
        table.loadData();
      }).catch(httpErrorCallback);
    };

    return <div>
      {others}
      <Button key="update" onClick={handleUpdate} className="list-btn" type="primary" size="small">更新</Button>
      <Popconfirm key="delete" placement="left" title={`确定要删除吗?`} onConfirm={handleDelete}>
        <Button size="small">删除</Button>
      </Popconfirm>
    </div>;
  }
}

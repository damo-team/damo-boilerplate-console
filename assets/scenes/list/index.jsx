import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Table from 'antd/lib/table';
import {DataSet, CustomForm} from 'damo-cntd';

import './index.less';

export default class List extends React.PureComponent {
  static extension = {
    title: '列表页面',
    layout: 'consoleLayout'
  }

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: ''
    }
  }

  render() {
    return (
      <div className="j-scene j-scene-list">
        <DataSet
          actions={{
          getUser: {
            uri: 'https://api.github.com/users/baqian',
            method: 'get',
            immediate: true,
            success: (res, setState) => {
              return setState({dataSource: [res]})
            }
          }
        }}
          attrs={{
          dataSource: {
            value: [
              {
                login: 'hello'
              }
            ]
          },
          columns: {
            schema: {
              type: 'object',
              properties: {
                login: {
                  title: 'name',
                  type: 'string',
                  default: 'hello'
                },
                operator: {
                  title: '操作',
                  actions: [{
                    action: 'getUser',
                    title: '获取用户',
                    modal: true
                  }, {
                    name: 'getUser1',
                    action: function(){
                      alert(1);
                    }
                  }]
                }
              }
            },
            format: 'tableColumn'
          }
        }}>
          <Table rowKey="login"/>
        </DataSet>
      </div>
    );
  }
}

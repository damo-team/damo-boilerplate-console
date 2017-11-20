import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Table from 'antd/lib/table';
import Damo from 'damo-core';

import DataSet from '../../../components/dataSet';

class BaseListScene extends Component{
  static extension = {
    title: '基础列表',
    layout: ['consoleLayout', 'contentLayout']
  }

  componentDidMount(){
    this.props.getList();
  }

  render(){  
    return (<div className="j-scene j-scene-baseList">
    <DataSet options={{
      columns: {
        schema: require('../../../devtool/schemas/todo_list.json'),
        format: 'table'
      }
    }}>
      <Table rowKey="id" dataSource={this.props.list.data} scroll={{ x: 1500, y: 300 }} loading={this.props.list.metric.loading}/>
    </DataSet>
    </div>)
  }
}


export default Damo.view(['list'], BaseListScene);

import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Damo from 'damo-core';

import Result from '../../../components/result';


export default class SuccessScene extends Component{
  static extension = {
    title: '反馈',
    layout: ['consoleLayout', 'contentLayout']
  }
  types= ['success', 'error'];
  constructor(props){
    super(props);
    this.state = {
      type: this.types[0]
    }
  }

  render(){
    const links = [{
      type: 'primary',
      size: 'large',
      render: () => {
        return (<Damo.Link to={Damo.route('/').resolvePath}>返回首页</Damo.Link>)
      }
    }];
    return (<Result
      type={this.state.type}
      title="结果反馈"
      description="提交结果页用于反馈一系列操作任务的处理结果， 如果仅是简单操作，使用 Message 全局提示反馈即可。 通过extra区域可以展示简单的补充说明，如果有类似展示 “单据”的需求"
      extra=""
      links={links}
      style={{ marginTop: 56 }}
    />)
  }
}

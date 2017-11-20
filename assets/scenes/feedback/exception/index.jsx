import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Damo from 'damo-core';

import Exception from '../../../components/Exception';


export default class ExceptionScene extends Component{
  static extension = {
    title: '异常',
    layout: ['consoleLayout', 'landingLayout'],
    layoutOption: {
      brand: null
    }
  }

  allStatus = [403, 404, 405];

  constructor(props){
    super(props);
    this.state = {
      status: this.allStatus[0]
    }
  }

  render(){
    const links = [{
      type: 'primary',
      size: 'large',
      render: () => {
        return (<Damo.Link to={Damo.route('/').resolvePath}>返回首页</Damo.Link>)
      }
    }]
    return (<Exception type={this.state.status} style={{ minHeight: 500, height: '80%' }} links={links} />)
  }
}

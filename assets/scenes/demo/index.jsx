import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

export default class Demo extends Component{
  static extension = {
    title: 'Damo页面'
  }
  render(){
    return (<h1>Hello World</h1>);
  }
}

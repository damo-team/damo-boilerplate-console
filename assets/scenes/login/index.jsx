import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Tabs from 'antd/lib/tabs';
import {DataSet, CustomForm} from 'damo-cntd';

import './index.less';

export default class Login extends React.PureComponent {
  static extension = {
    title: '登录页面',
    layout: 'simpleLayout'
  }

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: ''
    }
  }

  render() {
    return (
      <div className="j-scene j-scene-login">
        <Tabs animated={false} activeKey="account">
          <Tabs.TabPane tab="账户密码登录" key="account">
            {this.props.errorMessage}
            <CustomForm
              formLayout={{
              labelCol: {
                span: 0
              },
              wrapperCol: {
                span: 24
              }
            }}
              options={[
              {
                type: 'string',
                name: 'username',
                title: '账号'
              }, {
                type: 'string',
                name: 'password',
                title: '密码'
              }
            ]}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="手机号登录" key="mobile">
            {this.props.errorMessage}
            <CustomForm
              formLayout={{
              labelCol: {
                span: 0
              },
              wrapperCol: {
                span: 24
              }
            }}
              options={[
              {
                type: 'string',
                name: 'username',
                title: '账号'
              }, {
                type: 'string',
                name: 'password',
                title: '密码'
              }
            ]}/>
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

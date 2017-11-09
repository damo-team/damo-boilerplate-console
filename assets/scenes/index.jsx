import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Layout from 'antd/lib/layout';
import damo from 'damo-core';

import Sider from './sider';
import Header from './header';
import './index.less';

const COLLAPSED_KEY = 'damo_console_sidebar';

class Root extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    getUser: PropTypes.func.isRequired
  }

  static extension = {
    name: '导航'
  }

  componentWillMount(){
    this.props.getUser();
  }

  constructor(props) {
    super(props);
    this.state = {
      inited: true,
      collapsed: window
        .localStorage
        .getItem(COLLAPSED_KEY) === 'true' || false
    }
  }

  render() {
    const collapseCfg = {
      collapsed: this.state.collapsed,
      onCollapse: collapsed => {
        if(this.state.inited && this.state.collapsed){
          this.setState({inited: false});
          return;
        }
        this.setState({collapsed: collapsed, inited: false});
        window.localStorage
          .setItem(COLLAPSED_KEY, collapsed);
      }
    }

    return (
      <div className='layout-wrap'>
        <Layout className="ant-layout-has-sider">
        <Sider {...collapseCfg} route={this.props.children ? this.props.children.props.route : this.props.route} menus={damo.getRoutes()}/>
        <Layout>
          <Header {...collapseCfg} avatar={this.props.profile.avatar_url} nick={this.props.profile.login}/>
          <Layout.Content>
            {this.props.children}
          </Layout.Content>
        </Layout>
      </Layout>
      </div>
    )
  }
}

export default damo.view(['user'], Root);

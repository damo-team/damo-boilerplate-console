import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Layout from 'antd/lib/layout';
import damo from 'damo-core';

import Sider from './sider';
import Header from './header';

import './index.less';

const COLLAPSED_KEY = 'damo_console_sidebar';

export default class ConsoleLayout extends React.PureComponent {
  static getLayoutProps = function(parentProps, extra){
    return Object.assign({
      sider: {
        route: parentProps.children ? parentProps.children.props.route : parentProps.route,
        routes: damo.getRoutes()[0].childRoutes,
        subMenus: extra && extra.subRoutes
      },
      header: {
        avatar: parentProps.user.profile.avatar_url,
        nick: parentProps.user.profile.login
      },
      viewContent: parentProps.children || parentProps.component
    }, extra);
  }

  static propTypes = {
    sider: PropTypes.shape({
      route: PropTypes.object,
      routes: PropTypes.array,
      subRoutes: PropTypes.object,
      brand: PropTypes.object
    }),
    header: PropTypes.shape({
      avatar: PropTypes.string,
      nick: PropTypes.string
    }),
    viewContent: PropTypes.element,
    className: PropTypes.string
  }

  static defaultProps = {
    className: ''
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
      <div className={'j-layout-wrap ' + this.props.className}>
        <Layout className="ant-layout-has-sider">
        <Sider {...collapseCfg} {...this.props.sider}/>
        <Layout>
          <Header {...collapseCfg} {...this.props.header}/>
          <Layout.Content>
            {this.props.viewContent || this.props.children}
          </Layout.Content>
        </Layout>
      </Layout>
      </div>
    )
  }
}

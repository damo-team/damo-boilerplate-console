import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Layout from 'antd/lib/layout';

import Sider from '../../components/sider';
import Header from '../../components/header';

import './index.less';

const COLLAPSED_KEY = 'damo_console_sidebar';

export default class ConsoleLayout extends React.PureComponent {
  static getLayoutProps = function (parentProps, children, extra) {
    return Object.assign({
      sider: {
        route: parentProps.children
          ? parentProps.children.props.route
          : parentProps.route,
        routes: extra && extra.routes,
        subMenus: extra && extra.subRoutes
      },
      header: {
        avatar: parentProps.user.profile.avatar,
        nick: parentProps.user.profile.name
      },
      viewContent: children
    }, extra);
  }

  static propTypes = {
    sider: PropTypes.shape({route: PropTypes.object, routes: PropTypes.array, subRoutes: PropTypes.object, brand: PropTypes.object}),
    header: PropTypes.shape({avatar: PropTypes.string, nick: PropTypes.string}),
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
        if (this.state.inited && this.state.collapsed) {
          this.setState({inited: false});
          return;
        }
        this.setState({collapsed: collapsed, inited: false});
        window
          .localStorage
          .setItem(COLLAPSED_KEY, collapsed);
      }
    }
    return (
      <div className={'j-layout-console ' + this.props.className}>
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

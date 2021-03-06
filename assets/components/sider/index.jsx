import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';

import Damo from 'damo-core';
import './index.less';

const HTTP_PATTERN = /^https?:\/\//;

export default class Sider extends React.PureComponent {
  static propTypes = {
    routes: PropTypes.array.isRequired,
    route: PropTypes.object,
    collapsed: PropTypes.bool,
    brand: PropTypes.object,
    subMenus: PropTypes.object
  }

  static defaultProps = {
    subMenus: {},
    brand: {
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/iwWyPinUoseUxIAeElSx.svg',
      title: 'Damo App'
    }
  }

  constructor(props) {
    super(props);

    const route = props.route;
    this.state = {
      selectedKeys: route
        ? [Damo.getResolvePath(route)]
        : null,
      openKeys: route && route.parent
        ? this.getParnetsResolvePaths(route)
        : null,
      subMenus: props.subMenus
    }
  }

  getParnetsResolvePaths(route) {
    const resolvePaths = [];
    const navKey = route.navKey;
    while (route = route.parent) {
      resolvePaths.push(route.name);
    }
    if (navKey && this.props.subMenus[navKey]) {
      resolvePaths.push(this.props.subMenus[navKey].name);
    }
    return resolvePaths;
  }

  packNode(item, level) {
    const subMenus = this.state.subMenus;
    if (item.navKey && subMenus[item.navKey] && level < 1) {
      subMenus[item.navKey].children = subMenus[item.navKey].children || [];
      let idx = subMenus[item.navKey]
        .children
        .findIndex(d => d.name === item.name);
      if (idx === 0) {
        item = subMenus[item.navKey];
      } else if (idx === -1) {
        subMenus[item.navKey].children = subMenus[item.navKey].children || [];
        idx = subMenus[item.navKey]
          .children
          .push(item);
        if (idx > 1) {
          clearTimeout(this.$timer_);
          this.$timer_ = setTimeout(() => {
            clearTimeout(this.$timer_);
            this.setState({subMenus: subMenus});
          });
          return null;
        } else {
          const navKey = item.navKey;
          item = subMenus[item.navKey];
          item.name = navKey
        }
      } else {
        return null;
      }
    }

    // #! 从路由配置项中获取extension 和 childRoutes
    const extension = item.extension || {};
    const target = extension.target || item.target;
    const title = extension.title || item.title || item.name;
    const icon = extension.icon || item.icon;
    const iconCom = icon && (<Icon type={icon}/>);
    const children = item.children || item.childRoutes || [];

    if (title) {
      return {
        target: target,
        icon: iconCom,
        title: title,
        name: item.navKey
          ? item.navKey + '-' + item.name
          : item.name,
        children: children,
        path: children.length
          ? null
          : Damo.getResolvePath(item)
      }
    } else {
      return null;
    }
  }

  getNavMenuItems(menusData, level = 0) {
    if (!menusData) {
      return [];
    }
    return menusData.map((item) => {
      item = this.packNode(item, level);

      if (!item) {
        return null;
      }

      if (item.children.length) {
        return (
          <Menu.SubMenu
            title={item.icon
            ? (
              <span>
                {item.icon}
                <span className="j-menu-text">{item.title}</span>
              </span>
            )
            : (<span className="j-menu-text">{item.title}</span>)}
            key={item.title}>
            {this.getNavMenuItems(item.children, level + 1)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item key={item.path}>
          {HTTP_PATTERN.test(item.path)
            ? (
              <a href={item.path} target={item.target}>
                {item.icon}<span className="j-menu-text">{item.title}</span>
              </a>
            )
            : (
              <Damo.Link to={item.path} target={item.target}>
                {item.icon}<span className="j-menu-text">{item.title}</span>
              </Damo.Link>
            )
}
        </Menu.Item>
      );
    });
  }

  render() {
    return (
      <Layout.Sider
        trigger={null}
        collapsible
        collapsed={this.props.collapsed}
        breakpoint="md"
        onCollapse={this.props.onCollapse}
        width={256}
        className='j-sider'>
        <div className='j-sider-logo'>
          <Damo.Link to={Damo.route('/').resolvePath}>
            <img src={this.props.brand.logo} alt="logo"/>
            <h1 className="j-menu-text">{this.props.brand.title}</h1>
          </Damo.Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          openKeys={this.props.collapsed
          ? null
          : this.state.openKeys}
          onOpenChange={(openKeys) => this.setState({openKeys: openKeys})}
          onSelect={(item) => this.setState({selectedKeys: item.selectedKeys})}
          selectedKeys={this.state.selectedKeys}
          style={{
          margin: '16px 0',
          width: '100%'
        }}>
          {this.getNavMenuItems(this.props.routes)}
        </Menu>
      </Layout.Sider>
    )
  }
}

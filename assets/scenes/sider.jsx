import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';
import Beatle from '@ali/beatle';

export default class Sider extends Component {
  static propTypes = {
    menus: PropTypes.array.isRequired,
    route: PropTypes.object,
    collapsed: PropTypes.bool,
    route: PropTypes.object
  }

  constructor(props){
    super(props);

    const route = props.route;
    this.state = {
      selectedKeys: route ? [this.getResolvePath(route)] : null,
      openKeys: route && route.parent ? this.getParnetsResolvePaths(route) : null,
    }
  }

  getParnetsResolvePaths(route){
    const resolvePaths = [];
    while(route = route.parent){
      resolvePaths.push(route.name);
    }
    return resolvePaths;
  }

  getResolvePath(route){
    let resolvePath;
    if (route.resolvePath) {
      resolvePath = route.resolvePath;
    } else if(route.name){
      const paths = [route.name];
      let item = route;
      while(item = item.parent){
        paths.unshift(item.name);
      }
      resolvePath = paths.join('/').replace(/\/+/g, '/');
      route.resolvePath = resolvePath;
    }
    return resolvePath;
  }

  getNavMenuItems(menusData) {
    if (!menusData) {
      return [];
    }
    return menusData.map((item) => {
      // #! 从路由配置项中获取extension 和 childRoutes
      const extension = item.extension || {};
      const target = extension.target || item.target; 
      const name = extension.name || item.name;
      const icon = extension.icon && (<Icon type={extension.icon} />);
      const children = item.children || item.childRoutes || [];

      if (!name) {
        return null;
      }

      const itemPath = this.getResolvePath(item);
      
      if (children.length) {
        return (
          <Menu.SubMenu
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon} />
                  <span>{name}</span>
                </span>
              ) : name
            }
            key={item.name}
          >
            {this.getNavMenuItems(children)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item key={itemPath}>
          {
            /^https?:\/\//.test(itemPath) ? (
              <a href={itemPath} target={target}>
                {icon}<span>{name}</span>
              </a>
            ) : (
              <Beatle.Link to={itemPath} target={target}>
                {icon}<span>{name}</span>
              </Beatle.Link>
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
          <Beatle.Link to="/">
            <img
              src="https://gw.alipayobjects.com/zos/rmsportal/iwWyPinUoseUxIAeElSx.svg"
              alt="logo"/>
            <h1>Beatle-Console-App</h1>
          </Beatle.Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          openKeys={this.props.collapsed? null : this.state.openKeys}
          onOpenChange={(openKeys) => this.setState({openKeys: openKeys})}
          onSelect={(item) => this.setState({selectedKeys: item.selectedKeys})}
          selectedKeys={this.state.selectedKeys}
          style={{
          margin: '16px 0',
          width: '100%'
        }}>
          {this.getNavMenuItems(this.props.menus)}
        </Menu>
      </Layout.Sider>
    )
  }
}

import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';
import Dropdown from 'antd/lib/dropdown';
import Spin from 'antd/lib/spin';
import Avatar from 'antd/lib/avatar';

import HeaderSearch from '../../components/headerSearch';

export default class Header extends Component {
  static propTypes = {
    collapsed: PropTypes.bool,
    onCollapse: PropTypes.func,
    avatar: PropTypes.string,
    nick: PropTypes.string
  }

  constructor(props) {
    super(props);
  }

  toggleClick() {
    this
      .props
      .onCollapse(!this.props.collapsed);

    this.$resizeTimer_ = setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', true, false);
      window.dispatchEvent(event);
    }, 600);
  }

  componentWillUnmount() {
    clearTimeout(this.$resizeTimer_);
  }

  handleSearch() {}

  render() {
    return (
      <Layout.Header className='j-header'>
        <Icon
          className='j-header-trigger'
          type={this.props.collapsed
          ? 'menu-unfold'
          : 'menu-fold'}
          onClick={this
          .toggleClick
          .bind(this)}/>
        <div className='j-header-right'>
          <HeaderSearch
            className='j-header-action j-header-search'
            placeholder="站内搜索"
            dataSource={[]}
            onSearch={this
            .handleSearch
            .bind(this)}
            onPressEnter={this
            .handleSearch
            .bind(this)}/> {this.props.nick
            ? (
              <Dropdown
                overlay={(
                <Menu className='j-header-menu' selectedKeys={[]}>
                  <Menu.Item disabled><Icon type="user"/>个人中心</Menu.Item>
                  <Menu.Item disabled><Icon type="setting"/>设置</Menu.Item>
                  <Menu.Divider/>
                  <Menu.Item key="logout"><Icon type="logout"/>退出登录</Menu.Item>
                </Menu>
              )}>
                <span className='j-header-action j-header-account'>
                  <Avatar size="small" className='j-header-avatar' src={this.props.avatar}/> {this.props.nick}
                </span>
              </Dropdown>
            )
            : <Spin size="small" style={{
              marginLeft: 8
            }}/>}
        </div>
      </Layout.Header>
    )
  }
}

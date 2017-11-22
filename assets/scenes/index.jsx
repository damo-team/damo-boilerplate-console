import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Card from 'antd/lib/card';
import Damo from 'damo-core';

import AppModal from '../components/modal';
import Layer from '../layouts';
import './index.less';

class Root extends React.PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired
  }

  state = {
    layout: Layer.defaultLayout,
    layoutOption: {
      routes: Damo.getRoutes()[0].childRoutes || [],
      brand: {
        logo: 'https://gw.alipayobjects.com/zos/rmsportal/iwWyPinUoseUxIAeElSx.svg',
        title: 'Damo App'
      },
      subRoutes: {
        account: {
          icon: 'user',
          title: '账户'
        },
        console: {
          icon: 'table',
          title: '管控台'
        },
        detail: {
          icon: 'profile',
          title: '详情页'
        },
        form: {
          icon: 'form',
          title: '表单页'
        },
        search: {
          icon: 'card',
          title: '搜索页'
        },
        feedback: {
          icon: 'check-circle-o',
          title: '结果'
        }
      },
      links: [{
        title: '帮助',
        href: '',
      }, {
        title: '隐私',
        href: '',
      }, {
        title: '条款',
        href: '',
        blankTarget: true,
      }],
      copyright: 'Damo-Group 样板库'
    }
  }
  
  componentWillMount(){
    this.props.user.getUser();
  }

  renderOviewview(){
    return (<Card><img src="../overview.png" /></Card>);
  }

  getLayoutOption(){
    if(this.props.children){
      return {
        layouts: this.props.children.props.route.extension && [].concat(this.props.children.props.route.extension.layout || this.state.layout),
        option: Object.assign(this.state.layoutOption, this.props.children.props.route.extension && this.props.children.props.route.extension.layoutOption),
        children: this.props.children
      }
    }else{
      return {
        layouts: [this.state.layout],
        option: this.state.layoutOption,
        children: this.renderOviewview()
      }
    }
  }
  
  
  getLayout(layoutOption){
    const layoutType = layoutOption.layouts && layoutOption.layouts.pop() || this.state.layout;
    const Layout = Layer.getLayout(layoutType);
    const layoutProps = Layout.getLayoutProps(this.props, layoutOption.children, layoutOption.option);
    const LayoutElement = (<Layout {...layoutProps} />);
    
    if(layoutOption.layouts && layoutOption.layouts.length){
      layoutOption.children = LayoutElement;
      return this.getLayout(layoutOption);
    }else{
      return LayoutElement;
    }
  }

  render() {
    return (<div className="j-scene-root">{this.getLayout(this.getLayoutOption())}<AppModal/></div>)
  }
}


export default Damo.view(['user'], Root, true);

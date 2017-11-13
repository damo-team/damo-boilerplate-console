import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import damo from 'damo-core';

import Layer from '../layouts';
import './index.less';

const COLLAPSED_KEY = 'damo_console_sidebar';

class Root extends React.PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired
  }

  static extension = {
    title: '导航'
  }

  componentWillMount(){
    this.props.user.getUser();
  }

  getLayout(){
    if(this.props.children){
      const layoutType = this.props.children.props.route.extension && this.props.children.props.route.extension.layout;
      const Layout = Layer.getLayout(layoutType);
      const layoutProps = Layout.getLayoutProps(this.props, {
        subRoutes: {
          user: {
            title: '用户管理'
          }
        }
      });
      return (<Layout {...layoutProps} />);
    }else{
      const Layout = Layer.getLayout('consoleLayout');
      const layoutProps = Layout.getLayoutProps(this.props);
      return (<Layout {...layoutProps}>Landing Page ...</Layout>);
    }
  }

  render() {
    return (<div className="j-scene-root">{this.getLayout()}</div>)
  }
}

export default damo.view(['user'], Root, true);

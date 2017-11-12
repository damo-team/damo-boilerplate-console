import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import damo from 'damo-core';

import Layer from '../layouts';
import './index.less';

const COLLAPSED_KEY = 'damo_console_sidebar';

class Root extends React.PureComponent {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    getUser: PropTypes.func.isRequired
  }

  static extension = {
    title: '导航'
  }

  componentWillMount(){
    this.props.getUser();
  }

  getLayout(){
    if(this.props.children){
      const Layout = Layer.getLayout(this.props.children.props.route.extension.layout);
      const layoutProps = Layout.getLayoutProps(this.props);
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

export default damo.view(['user'], Root);

import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Layout from 'antd/lib/layout';
import damo from 'damo-core';

import ConsoleLayout from '../layouts/consoleLayout';
import './index.less';

const COLLAPSED_KEY = 'damo_console_sidebar';

class Root extends Component {
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

  render() {
    const layoutProps = ConsoleLayout.getLayoutProps(this.props);

    return (<ConsoleLayout {...layoutProps} />)
  }
}

export default damo.view(['user'], Root);

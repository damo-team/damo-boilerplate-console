import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Icon from 'antd/lib/icon';
import Card from 'antd/lib/card';
import Damo from 'damo-core';

import GlobalFooter from '../../components/globalFooter';
import BreadCrumb from '../../components/breadCrumb';
import './index.less';

export default class ContentLayout extends React.PureComponent {
  static getLayoutProps = function (parentProps, children, extra) {
    let route = parentProps.children.props.route;
    const navs = [{
      text: route.extension.title
    }];
    if(route.navKey && extra.subRoutes[route.navKey]){
      navs.unshift({
        text: extra.subRoutes[route.navKey].title || route.navKey
      });
    }
    while((route = route.parent) && route.extension){
      navs.unshift({
        link: route.resolvePath,
        text: route.extension.title
      });
    }
    return Object.assign({
      breadcrumb: {
        navs: navs
      },
      viewContent: children
    }, extra);
  }

  static propTypes = {
    breadcrumb: PropTypes.shape({className: PropTypes.string, navs: PropTypes.array, links: PropTypes.array, extra: PropTypes.node}),
    viewContent: PropTypes.element,
    className: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  render() {
    return (
      <div className={'j-layout-content ' + this.props.className}>
        <BreadCrumb {...this.props.breadcrumb}/>
        <div className="j-content">
          <Card bordered={false}>
          {this.props.viewContent || this.props.children}
          </Card>
        </div>
        <GlobalFooter
          className="j-footer"
          links={this.props.links}
          copyright={this.props.copyright}/>
      </div>
    );
  }
}

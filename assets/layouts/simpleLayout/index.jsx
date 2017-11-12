import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Icon from 'antd/lib/icon';
import damo from 'damo-core';

import GlobalFooter from '../../components/GlobalFooter';
import './index.less';

export default class UserLayout extends React.PureComponent {
  static getLayoutProps = function(parentProps, extra){
    return Object.assign({
      viewContent: parentProps.children || parentProps.component
    }, extra);
  }

  static propTypes = {
    brand: PropTypes.shape({
      logo: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string
    }),
    viewContent: PropTypes.element,
    className: PropTypes.string,
    links: PropTypes.array,
    copyright: PropTypes.node
  }

  static defaultProps = {
    className: '',
    brand: {
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/iwWyPinUoseUxIAeElSx.svg',
      title: 'Damo App'
    }
  }

  render() {
    const brand = this.props.brand;
    return (
        <div className={'j-container ' + this.props.className}>
          <div className="j-top">
            <div className="j-header">
              <damo.Link to="/">
                <img alt="" className="j-logo" src={brand.logo} />
                <span className="j-title">{brand.title}</span>
              </damo.Link>
            </div>
            {brand.description ? (<p className="j-desc">{brand.description}</p>) : null}
          </div>
          {this.props.viewContent || this.props.children}
          <GlobalFooter className="j-footer" links={this.props.links} copyright={this.props.copyright} />
        </div>
    );
  }
}

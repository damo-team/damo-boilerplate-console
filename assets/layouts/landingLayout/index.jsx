import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Icon from 'antd/lib/icon';
import Damo from 'damo-core';

import GlobalFooter from '../../components/globalFooter';
import './index.less';

export default class LandingLayout extends React.PureComponent {
  static getLayoutProps = function (parentProps, children, extra) {
    return Object.assign({
      viewContent: children
    }, extra);
  }

  static propTypes = {
    brand: PropTypes.shape({logo: PropTypes.string, title: PropTypes.string, description: PropTypes.string}),
    viewContent: PropTypes.element,
    className: PropTypes.string,
    links: PropTypes.array,
    copyright: PropTypes.node
  }

  static defaultProps = {
    className: ''
  }

  render() {
    const brand = this.props.brand;
    return (
      <div className={'j-layout-landing ' + this.props.className} style={{
        padding: this.props.brand ? '110px 0 144px' : '0'
      }}>
        {this.props.brand && (<div className="j-top">
          <div className="j-header">
            <Damo.Link to={Damo.route('/').resolvePath}>
              <img alt="" className="j-logo" src={brand.logo}/>
              <span className="j-title">{brand.title}</span>
            </Damo.Link>
          </div>
          {brand.description
            ? (
              <p className="j-desc">{brand.description}</p>
            )
            : null}
        </div>)}
        {this.props.viewContent || this.props.children}
        <GlobalFooter
          className="j-footer"
          links={this.props.links}
          copyright={this.props.copyright}/>
      </div>
    );
  }
}

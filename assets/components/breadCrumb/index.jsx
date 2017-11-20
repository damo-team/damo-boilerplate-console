import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Breadcrumb from 'antd/lib/breadcrumb';
import Damo from 'damo-core';

import NavLink from '../navLink';
import './index.less';

export default class BreadCrumb extends PureComponent {
  render() {
    const {className, navs, links, extra} = this.props;

    return (
      <div className={'j-breadcrumb ' + className}>
        <Breadcrumb>
          {navs
            .map((item, index) => {
              if (item.link) {
                return (
                  <Breadcrumb.Item key={index}>
                    <Damo.Link to={item.link}>{item.text}</Damo.Link>
                  </Breadcrumb.Item>
                )
              } else {
                return (
                  <Breadcrumb.Item key={index}>
                    {item.text}
                  </Breadcrumb.Item>
                );
              }
            })}
          <Breadcrumb.Item className="j-breadcrumb-extra">
            {links && <NavLink links={links}/>}
            {extra}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
    );
  }
}


import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Icon from 'antd/lib/icon';

import './index.less';

export default class HeaderSearch extends PureComponent {
  static copyright = (
    <div>Copyright
      <Icon type="copyright"/>
      2017 蚂蚁金服体验技术部出品</div>
  );
  render() {
    const {className, links, copyright} = this.props;

    return (
      <div className={'globalFooter ' + className}>
        {links && (
          <div className="links">
            {links.map(link => (
              <a
                key={link.title}
                target={link.blankTarget
                ? '_blank'
                : '_self'}
                href={link.href}>
                {link.title}
              </a>
            ))}
          </div>
        )}
        {copyright && <div className="copyright">{copyright}</div>}
      </div>
    );
  }
}

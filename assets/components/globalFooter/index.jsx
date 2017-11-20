import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Icon from 'antd/lib/icon';

import './index.less';

export default class GlobalFooter extends PureComponent {
  render() {
    const {className, links, copyright} = this.props;

    return (
      <div className={'globalFooter ' + className}>
        {links && (
          <div className="links">
            {links.map(link => {
              const linkProps = link.action
                ? {
                  onClick: (e) => link.action(e, link)
                }
                : {
                  target: link.blankTarget
                    ? '_blank'
                    : '_self',
                  href: link.href
                }
              return (
                <a key={link.name || link.title} {...linkProps}>
                  {link.title}
                </a>
              )
            })}
          </div>
        )}
        {copyright && <div className="copyright">{copyright}</div>}
      </div>
    );
  }
}

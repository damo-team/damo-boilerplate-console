import React from 'react';
import ReactDOM from 'react-dom';
import Icon from 'antd/lib/icon';

import NavLink from '../navLink';
import './index.less';

export default function Result({
  className, type, title, description, extra, links, ...restProps
}) {
  const iconMap = {
    error: <Icon className="error" type="close-circle" />,
    success: <Icon className="success" type="check-circle" />,
  };
  return (
    <div className={'j-result ' + className} {...restProps}>
      <div className="icon">{iconMap[type]}</div>
      <div className="title">{title}</div>
      {description && <div className="description">{description}</div>}
      {extra && <div className="extra">{extra}</div>}
      {links && (<div className="actions"><NavLink links={links} /></div>)}
    </div>
  );
}

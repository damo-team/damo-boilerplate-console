import Modal from 'antd/lib/modal';
import {NavLink} from '../../navLink';

export default function formFormatter(value, schema) {
  const options = [];
  const properties = schema.properties ? schema.properties : schema;
  for (let name in properties) {
    let item = properties[name];
    item.key = item.name = name;

    if (!item.disabled) {
      item.title = item.title || name;
      item.placeholder = item.placeholder  || item.description;
      options.push(item);
    }
  }
  return options;
}

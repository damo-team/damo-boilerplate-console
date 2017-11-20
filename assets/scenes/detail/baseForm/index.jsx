import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Damo from 'damo-core';
import CustomForm from '../../../components/customForm';
import DataSet from '../../../components/dataSet';

class BaseFormScene extends Component {
  static extension = {
    title: '基础表单',
    layout: ['consoleLayout', 'contentLayout']
  }

  componentDidMount() {
    this
      .props
      .user
      .getUser();
  }

  render() {
    return (
      <div className="j-scene j-scene-baseForm">
        <DataSet
          options={{
          options: {
            schema: require('../../../devtool/schemas/account.json'),
            format: 'form'
          }
        }}>
          <CustomForm dataSource={this.props.user.profile}/>
        </DataSet>
      </div>
    )
  }
}

export default Damo.view(['user'], BaseFormScene, true);

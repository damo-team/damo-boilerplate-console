import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import {ResourceModel, BaseSelector, ucfirst} from 'damo-core';
import formatters from './formatter';

export default class DataSet extends React.PureComponent {
  static formatters = formatters; //{};

  static themeOptions = {};

  static theme = (themeOptions) => {
    DataSet.themeOptions = themeOptions;
  }

  static getNotifier = () => {};
  static getFallback = () => {};

  static getActionName = (name) => name;

  static childContextTypes = {
    dataModel: PropTypes.object
  }

  static propTypes = {
    type: PropTypes.string,
    component: PropTypes.element,
    options: PropTypes.object,
    actions: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);

    this.state = {};
    this.stateUpdater = {};

    this.setActions();

    /**
     * prop = {
     *  value: Object | Function,
     *  format: String,
     *  formatter: Function,
     *  setter: String | Function
     * }
     */
    Object
      .keys(props.options)
      .forEach(name => {
        const prop = props.options[name];
        const originValue = typeof prop.value === 'function'
          ? prop.value.call(this, this.props)
          : prop.value;
        const formatter = prop.formatter || prop.format && DataSet.formatters[prop.format];
        // formatter是一系列解决组件schema的格式化函数
        if (formatter) {
          this.state[name] = formatter.call(this, originValue, prop.schema);
        } else {
          this.state[name] = originValue;
        }
        this.stateUpdater[prop.setter] = (updateFn, callback) => (this.setState(({stateName}) => () => {
          let newValue = typeof updateFn === 'function'
            ? updateFn.call(this, stateName)
            : updateFn;
          const formatter = prop.formatter || prop.format && DataSet.formatters[prop.format];
          if (formatter) {
            newValue = formatter.call(this, newValue, prop.schema);
          } else {
            newValue = newValue;
          }
          return newValue;
        }, callback))
      });
  }

  getModel() {
    this.$dataModel_;
  }
  /**
   * action = {
   *  request,
   *  url,
   *  method,
   *  header,
   *
   *  error,
   *  success,
   *  getParams,
   *  immediate
   * }
   */
  setActions() {
    if (this.$dataModel_) {
      this
        .$dataModel_
        .setProps(this.props);
    } else {
      const actions = this.props.actions;
      const requestObj = {};
      const newActions = {};
      const immediateActions = [];
      for (let name in actions) {
        let action = actions[name];
        requestObj[name] = (params, callback) => {
          params = action.getParams
            ? action.getParams(...args)
            : params || {};
          const error = typeof action.error === 'function'
            ? action
              .error
              .bind(this)
            : action.error && DataSet.getNotifier(action.error);
          const success = typeof action.success === 'function'
            ? action
              .success
              .bind(this)
            : action.success && DataSet.getFallback(action.success);
          const newCallback = (err, res) => {
            if (err) {
              error && error(err);
            } else if (success) {
              const result = success(res, (state) => {
                this.setState(state);
              });
            }
            callback && callback(err, res)
          }
          if (action.request) {
            return action.request(params, newCallback);
          } else {
            return this
              .$dataModel_
              .request(name, params, newCallback);
          }
        }
        if (!action.request) {
          newActions[name] = action;
        }
        if (action.immediate) {
          immediateActions.push(name);
        }
      }

      this.$dataModel_ = new ResourceModel({
        actions: newActions
      }, this.props);

      immediateActions.forEach(name => {
        requestObj[name]();
      });
      Object.assign(this.$dataModel_, requestObj);
    }
  }

  getAction(action){
    return this.$dataModel_[action] && this.$dataModel_[action].bind(this.$dataModel_);
  }

  getRealInstance() {
    return this.$instance_;
  }

  request(name, params) {
    return this.context.dataModel[name](params, (err, res) => {
      const nextState = this.props.actions[name].updater === true
        ? res
        : this
          .props
          .actions[name]
          .updater(err, res, this.props);
      if (Object(nextState) === nextState) {
        this.setState(nextState);
      }
    });
  }

  render() {
    let option = {},
      type;
    if (this.props.component) {
      type = this.props.component.name;
      if (type && DataSet.themeOptions[type]) {
        option = DataSet.themeOptions[type];
      }

      if (this.props.children) {
        return (
          <this.props.component
            ref={instance => this.$instance_ = instance}
            {...option}
            {...this.props}
            {...this.state}
            {...this.stateUpdater}>{this.props.children}</this.props.component>
        )
      } else {
        return (<this.props.component
          ref={instance => this.$instance_ = instance}
          {...option}
          {...this.props}
          {...this.state}
          {...this.stateUpdater}/>)
      }
    } else {
      type = this.props.children.type.name;
      if (type && DataSet.themeOptions[type]) {
        option = DataSet.themeOptions[type];
      }
      return React.cloneElement(React.Children.only(this.props.children), {
        ref: instance => this.$instance_ = instance,
        ...option,
        ...this.props,
        ...this.state,
        ...this.stateUpdater
      });
    }
  }
}

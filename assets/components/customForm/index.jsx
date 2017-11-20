import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Select from 'antd/lib/select';
import DatePicker from 'antd/lib/date-picker';
import TimePicker from 'antd/lib/time-picker';
import Radio from 'antd/lib/radio';
import Checkbox from 'antd/lib/checkbox';
import Switch from 'antd/lib/switch';
import Cascader from 'antd/lib/cascader';
import Card from 'antd/lib/card';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';

import moment from 'moment';

import './index.less';

@Form.create({widthRef: true})
export default class CustomForm extends React.PureComponent {
  static contextTypes = {
    router: PropTypes.object
  }

  static proptTypes = {
    dataSource: PropTypes.object,
    options: PropTypes.array.isRequired,
    formLayout: PropTypes.object,
    validateRules: PropTypes.array,
    beforeSave: PropTypes.func,
    submit: PropTypes.func,
    layout: PropTypes.string,
    buttons: PropTypes.object,
    noButton: PropTypes.bool
  }

  static defaultProps = {
    layout: 'horizontal',
    dataSource: {},
    validateRules: {},
    formLayout: {
      labelCol: {
        span: 3
      },
      wrapperCol: {
        span: 20
      },
      hasFeedback: true,
      required: true
    },
    buttons: [
      {
        type: 'primary',
        name: 'save',
        text: '保存'
      }, {
        type: 'default',
        name: 'cancel',
        text: '取消'
      }
    ]
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  handleSubmit() {
    this
      .props
      .form
      .validateFields((errors, body) => {
        if (errors) {
          message.error('表单校验失败');
          return false;
        } else {
          body = this.props.beforeSave
            ? this
              .props
              .beforeSave(body)
            : body;

          if (body === false) {
            return;
          }

          const result = this.props.onSubmit && this
            .props
            .onSubmit(body, this.props.dataSource);
          if (result && result.then) {
            result.then(() => {
              this
                .context
                .router
                .goBack();
            });
            return result;
          } else {
            this
              .context
              .router
              .goBack();
            return Promise.resolve(result);
          }
        }
      });
  }

  handleCancel(){
    this
    .context
    .router
    .goBack();
  }

  handleClick(e, item) {
    if(item.action){
      item.action(this.handleSubmit.bind(this), this.handleCancel.bind(this));
    }else{
      switch (item.name) {
        case 'save':
          this.handleSubmit();
          break;
        case 'cancel':
          this.handleCancel();
          break;
      }
    }
  }

  renderInput(option, key) {
    if (!option.name) 
      return null;
    if (option.children) {
      const renderInput = this
        .renderInput
        .bind(this);
      return (
        <Card
          key={key}
          style={{
          padding: '15px 15px 7px'
        }}
          title={option.title || option.name}>{option
            .children
            .map(renderInput)}</Card>
      );
    }
    const formItemProps = Object.assign({
      label: option.title || option.name,
      required: option.required,
      hasFeedback: option.hasFeedback,
      help: option.help,
      className: option.className
    }, this.props.formLayout);

    const propsByState = option.getProps
      ? option.getProps(this.props.dataSource, this.state, nextState => this.setState(nextState))
      : {};
    let rules = this.props.validateRules[option.name];
    const defaultProps = {
      disabled: option.disabled,
      placeholder: option.placeholder
    }
    const decoratorProps = {
      initialValue: this.props.dataSource[option.name] || option.default,
      rules: option.rules
          ? option.rules.concat(rules || [])
          : rules
    }
    let input;
    if (option.render) {
      return option.render(key, (input, dpros) => {
        return (<Form.Item key={key} {...formItemProps}>{this
          .props
          .form
          .getFieldDecorator(option.name, Object.assign(decoratorProps, dpros))(input)}</Form.Item>)
      }, Object.assign(defaultProps, propsByState), this.props.form);
    } else {
      switch (option.type) {
        case 'number':
        case 'integer':
          let maxLength = option.maxLength
            ? option.maxLength
            : 10;
          maxLength = +new Array(maxLength).join(9);
          if (option.maximum) {
            maxLength = Number(maxLength + '0.' + option.maximum);
          }

          input = (<InputNumber
            style={{
            width: 250
          }}
            min={option.minLength
            ? option.minLength
            : 0}
            max={maxLength}
            {...defaultProps}
            {...propsByState}/>);
          break;
        case 'boolean':
          input = (<Switch
            disabled={option.disabled}
            unCheckedChildren={option.placeholder}
            {...propsByState}/>);
          break;
        case 'string':
          switch (option.format) {
            case 'DATE_TIME':
              decoratorProps.initialValue = moment(decoratorProps.initialValue);
              input = (<DatePicker
                style={{width: 250}}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                {...defaultProps}
                {...propsByState}/>);
              break;
            case 'DATE':
            decoratorProps.initialValue = moment(decoratorProps.initialValue);
              input = (<DatePicker style={{width: 250}} {...defaultProps} {...propsByState}/>);
              break;
            case 'TIME':
            decoratorProps.initialValue = moment(decoratorProps.initialValue);
              input = (<TimePicker style={{width: 250}} {...defaultProps} {...propsByState}/>);
              break;
            case 'DATE_RANGE':
              input = (<DatePicker.RangePicker {...defaultProps} {...propsByState}/>);
              break;
            case 'CDN_PIC':
              Object.assign(decoratorProps, {
                valuePropName: 'fileList',
                getValueFromEvent: (e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e && e.fileList;
                }
              });
              if (option.dragger) {
                input = (
                  <Upload.Dragger
                    {...defaultProps}
                    {...propsByState}
                    listType="picture"
                    action={option.action}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">点击或者托转文件到上传区域</p>
                  </Upload.Dragger>
                )
              } else {
                input = (
                  <Upload
                    {...defaultProps}
                    {...propsByState}
                    action={option.action}
                    listType="picture">
                    <Button>
                      <Icon type="upload"/>
                      上传图片
                    </Button>
                  </Upload>
                );
              }
              break;
            case 'FILE':
              Object.assign(decoratorProps, {
                valuePropName: 'fileList',
                getValueFromEvent: (e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e && e.fileList;
                }
              });

              if (option.dragger) {
                input = (
                  <Upload.Dragger
                    {...defaultProps}
                    {...propsByState}
                    listType="text"
                    action={option.action}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">点击或者托转文件到上传区域</p>
                  </Upload.Dragger>
                )
              } else {
                input = (
                  <Upload
                    {...defaultProps}
                    {...propsByState}
                    action={option.action}
                    listType="text">
                    <Button>
                      <Icon type="upload"/>
                      上传文件
                    </Button>
                  </Upload>
                );
              }
              break;
            case 'SELECT':
              input = (
                <Select mode={option.mode} {...defaultProps} {...propsByState}>
                  {option
                    .options
                    .map(item => (
                      <Select.Option
                        key={item.value || item.id}
                        value={item.value || item.id}
                        disabled={item.disabled}>{item.name || item.text}</Select.Option>
                    ))}
                </Select>
              );
              break;
            case 'TEXT':
              input = (<Input
                type="textarea"
                autosize={{
                minRows: 4,
                maxRows: 10
              }}
                {...defaultProps}
                {...propsByState}/>);
              break;
            default:
              input = (<Input {...defaultProps} {...propsByState}/>);
              break;
          }
          break;
      }
    }
    return (
      <Form.Item key={key} {...formItemProps}>{this
          .props
          .form
          .getFieldDecorator(option.name, decoratorProps)(input)}</Form.Item>
    )
  }

  render() {
    const dataSource = this.props.dataSource;
    const renderInput = this
      .renderInput
      .bind(this);
    return (
      <Form
        layout={this.props.layout}
        onSubmit={(e) => {
        e.preventDefault();
        this.handleSubmit();
      }}>{this
          .props
          .options
          .map(renderInput)} {!this.props.noButton
          ? (
            <Form.Item
              wrapperCol={{
              offset: this.props.formLayout.labelCol.span,
              span: this.props.formLayout.wrapperCol.span
            }}>
              {this
                .props
                .buttons
                .map((btn, index) => (
                  <Button
                    onClick={(e) => this.handleClick(e, btn)}
                    style={{
                    marginRight: 10
                  }}
                    key={index}
                    type={btn.type}
                    size={btn.size}>{btn.text}</Button>
                ))}
            </Form.Item>
          )
          : null}
      </Form>
    )
  }
}

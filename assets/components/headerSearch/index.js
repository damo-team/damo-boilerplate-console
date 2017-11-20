import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import AutoComplete from 'antd/lib/auto-complete';

import './index.less';

export default class HeaderSearch extends PureComponent {
  static defaultProps = {
    defaultActiveFirstOption: false,
    onPressEnter: () => {},
    onChange: () => {},
    onSearch: () => {},
    className: '',
    placeholder: '',
    dataSource: []
  };
  static propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,
    onSearch: PropTypes.func,
    onPressEnter: PropTypes.func,
    onChange: PropTypes.func,
    defaultActiveFirstOption: PropTypes.bool,
    dataSource: PropTypes.array
  };
  state = {
    searchMode: false,
    value: ''
  };
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  onKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.timeout = setTimeout(() => {
        this
          .props
          .onPressEnter(this.state.value); // Fix duplicate onPressEnter
      }, 0);
    }
  }
  onChange = (value) => {
    this.setState({value});
    this
      .props
      .onChange();
  }
  enterSearchMode = () => {
    this.setState({
      searchMode: true
    }, () => {
      if (this.state.searchMode) {
        this
          .input
          .focus();
      }
    });
  }
  leaveSearchMode = () => {
    this.setState({searchMode: false, value: ''});
  }
  render() {
    const {
      className,
      placeholder,
      ...restProps
    } = this.props;
    return (
      <span
        className={'headerSearch ' +  className}
        onClick={this.enterSearchMode}>
        <Icon type="search"/>
        <AutoComplete
          className={'input ' + (this.state.searchMode ? 'show' : '')}
          value={this.state.value}
          onChange={this.onChange}
          {...restProps}>
          <Input
            placeholder={placeholder}
            ref={(node) => {
            this.input = node;
          }}
            onKeyDown={this.onKeyDown}
            onBlur={this.leaveSearchMode}/>
        </AutoComplete>
      </span>
    );
  }
}

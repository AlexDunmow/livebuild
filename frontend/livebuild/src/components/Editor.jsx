import React, {Component} from 'react';
import CodeMirror from 'react-codemirror';

import {On, Off} from './Events.js'

import ActivityIndicator from 'react-activity-indicator'

import GetStore, {getCode, updateCode} from './Store.js'

require('codemirror/mode/javascript/javascript');
require('codemirror/mode/css/css');
require('codemirror/mode/htmlmixed/htmlmixed');

export default class Editor extends Component {
  constructor(props) {
    super(props)

    this.store = GetStore()
    this.state = {
        code: props.path == "introduction" ? intro : getCode(props.path),
        loading: props.path == "introduction" ? false : true
    };

    let timeout

    this.updateCode = (newCode) => {
      updateCode(props.path, newCode)
    }

    this.unsubscribe = this.store.subscribe(() => {
      let code = this.store.getState().get('code').get(this.props.path)

      if (typeof code == "string" && this.state.loading) {
        this.setState({
          code: code,
          loading: false
        });
        return
      }
      if (!this.refs.cm) { return }
      if (code != this.refs.cm.getCodeMirror().getValue()) {
        this.setState({
          code: code,
          loading: false
        });
      }
    })
  }
  refreshCM = () => {
    if (this.refs.cm) this.refs.cm.getCodeMirror().refresh()
  }
  componentWillUnmount() {
    Off('layoutchange',this.refreshCM)
    this.unsubscribe()
  }
  componentDidMount() {
    this.refreshCM()
    On('layoutchange',this.refreshCM)
  }
  componentDidUpdate = () => {
    if (!this.refs.cm) { return }
    this.refreshCM()
  }
  render() {
    let mode
    let ext = this.props.path.split('.').pop();
    switch (ext) {
      case "js":
        mode = "javascript"
        break
      case "css":
        mode = "css"
        break
      case "html":
        mode = "htmlmixed"
        break
      default:
        mode = "text"
    }

    let options = {
        lineNumbers: true,
        mode: mode,
        theme: 'vibrant-ink',
        lineWrapping: true,
        autofocus: true
    };
    if (this.state.loading) {
      return <ActivityIndicator activeColor="#F92672" borderRadius="50%" duration={200} />
    }
    return (
      <CodeMirror ref="cm" value={this.state.code} onChange={this.updateCode.bind(this)}  options={options} />
    );
  }
}

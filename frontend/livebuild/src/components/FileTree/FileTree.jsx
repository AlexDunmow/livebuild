import React, {Component} from 'react';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import FontAwesome from '../FontAwesome.jsx'
import Prompt from '../Prompt.jsx'

import GetStore from '../Store.js'
import superagent from 'superagent'
import {On, Off, Emit} from '../Events.js'

import Branch from './Branch.jsx';
import ContextMenu from './Menu.jsx'

import Toolbar from 'react-ninjatoolbar'

class FileTree extends Component {
  constructor(props) {
    super(props)
    this.state = {newFolder:false}
    this.store = GetStore()
    this.unsubscribe = this.store.subscribe(() => {
      this.forceUpdate()
    })
  }

  drop = (props, monitor, component) => {
    superagent.post('/build/move')
      .accept('application/json')
      .send({
        from: monitor.getItem().node.get('path'),
        to: props.node.get('path')
      })
      .end((err, res) => {
        if (err) {
          alert(err);
          return
        };
        this.store.dispatch({
          type: "LOAD:FILES",
          files: res.text
        })
      }
    );
   
  }

  onClick = (node) => {
    Emit('nodeclick', node)
  }

  render() {
    let state = this.store.getState()
    let files = state.get('files')

    let children = []
    files.map((n) => {
      children.push(<Branch node={n} key={n.get('path')} dropFn={this.drop} onClick={this.onClick} />)
    })

    return (
      <div className="files-pane">
        <div className="tree-container">
          {children}
          <ContextMenu />
        </div>
        <Toolbar
         items={[
            {
              text: (<FontAwesome
                  style={{fontSize:"10px"}}
                  name={["fa-folder-o fa-stack-2x", "fa-plus fa-stack-1x"]} 
                />),
              onClick: () => {
                this.setState({newFolder:true})
              }
            },
            {
              text: (
                <FontAwesome
                  style={{fontSize:"10px"}}
                  name={["fa-file-o fa-stack-2x", "fa-plus fa-stack-1x"]} 
                />
              )
            },
            {text: "test" },
            {text: "test" },
            {text: "test" },
            {text: "test" },
            {text: "test" },
            {text: "test" },
            {text: "test" },
            {text: "test" },
            {text: "test" },
            {text: "test" },
            {text: "test" },
            {text: "test" },
            {text: "test" },
            {text: "test" }
         ]}></Toolbar>
        {(() => {
          if (this.state.newFolder) {
            return <Prompt text="New folder name" buttons={[{
              text: "OK",
              onClick: (value) => {
                this.setState({newFolder:false})
                Emit("newfolder", value)
              }
            }]} onMaskClick={() => {this.setState({newFolder:false})}} />
          }
        })()}
      </div>
    );
  }
};


export default DragDropContext(HTML5Backend)(FileTree);
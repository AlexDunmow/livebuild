import React, {PropTypes, Component} from 'react';
import { ContextMenu, MenuItem, connect } from "react-contextmenu";

import {Emit} from '../Events.js'

class Menu extends Component {
  displayName: "Menu"
	render() {
		let { node } = this.props.item;
    let type;
    if (!node) {
      type = "undefined"
    } else {
      type = node.get('type')
    }

    return (
      <ContextMenu identifier="filebranch" currentItem={this.currentItem}>
        {(() => {
          let mitems = []
          if (type == "directory") {
            mitems.push(<MenuItem key="newfolder" data={{node: node, action:"newfolder"}} onClick={this.handleClick}>
              New Folder
            </MenuItem>)
            mitems.push(<MenuItem key="newfile" data={{node: node, action:"newfile"}} onClick={this.handleClick}>
              New File
            </MenuItem>)
          } else if (type == "file") {
            mitems.push(<MenuItem key="open" data={{node: node, action:"open"}} onClick={this.handleClick}>
            Open new pane
          </MenuItem>)
          }
          return mitems
        })()}
        <MenuItem data={{node: node, action:"rename"}} onClick={this.handleClick}>
          Rename
        </MenuItem>
        <MenuItem data={{node: node, action:"delete"}} onClick={this.handleClick}>
          Delete
        </MenuItem>
      </ContextMenu>
    )
  }
  handleClick = (e, data) => {
    Emit('menu:'+data.action, data.node)
  }
}

export default connect(Menu);
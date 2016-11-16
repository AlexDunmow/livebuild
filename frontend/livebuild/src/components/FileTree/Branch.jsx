import React, {PropTypes, Component} from 'react';

import { DragSource, DropTarget } from 'react-dnd';
import TreeView from './TreeView.jsx'
import Label from './Label.jsx'
import FontAwesome from '../FontAwesome.jsx'

import { ItemTypes } from './constants';

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

const target = {
  canDrop(props, monitor) {
    return props.isDragging ? false : true;
  },

  drop(props, monitor, component) {
  	const hasDroppedOnChild = monitor.didDrop();
    if (hasDroppedOnChild) {
      return;
    }
  	props.dropFn(props, monitor, component)
  }
};

const folderSource = {
  beginDrag(props) {
    return props;
  }
};

class Branch extends Component {
	constructor(props) {
		super(props)
		this.node = props.node
		this.state = {renaming: false, name: props.node.get('name')}
	}
	onClick = (event) => {
		event.stopPropagation();
		this.props.onClick(this.node)
	}

	isStringAcceptable = (s) => {
	  if (s != "") { return true }
	}

  startRename = () => {
  	this.setState({renaming: true})
  }

  stopRename = () => {
  	this.setState({renaming: false})	
  }

	rename = (event) => {
    this.setState({name: event.target.value});
  }

  render() {
    const { 
      connectDragSource,
      isDragging,
      node,
			dropFn,
			onClick,
      defaultCollapsed,
      connectDropTarget,
      isOverCurrent,
      isOver, canDrop
    } = this.props;

		const nodeChildren = node.get('children') || []
		const type = node.get('type')
		const ftype = node.get('fileType')

		let openLabel, closedLabel, icon

		if (type == "directory") {
		  openLabel = <FontAwesome style={{color:"#00B9D7"}} name="folder-open" />
		  closedLabel = <FontAwesome style={{color:"#00B9D7"}} name="folder" />
		} else {
		  switch (ftype) {
		    case "css": 
		      openLabel = <span style={{color:"#82CDB9"}} className="tree-icon icon-css" />
		      break
		    case "js":
		    case "jsx":
		      openLabel = <span style={{color:"#F37259"}} className="tree-icon icon-javascript" />
		      break
		    case "html":
		      openLabel = <span style={{color:"#00d6b5"}} className="tree-icon icon-html" />
		      break
		    case "png":
		    case "jpg":
		    case "gif":
		      openLabel =  <FontAwesome style={{color:"#FDF5A9"}} name="file-image-o" />
		      break
		    case "txt":
		      openLabel = <FontAwesome style={{color:"#dddddd"}} name="file-text-o"/>
		      break
		    default: openLabel = <FontAwesome name="file-o" />
		  }
		  if (!openLabel) {
		    openLabel = <div className="tree-icon" style={{ background: "url("+icon+")" }} />;
		  }
		}

    let style = {
    	opacity: isDragging ? 0.5 : 1,
    	cursor: isDragging ? 'move' : 'grab'
    }

    if (type == "directory" && isOverCurrent) {
    	if (!canDrop) {
    		style.border = '1px solid red'
    	} else {
    		style.border = '1px solid cyan'
    	}
    	style.cursor = 'crosshair'
    	style.padding = "2px"
    } else if (type == "file" && isOverCurrent) {
    	style.borderBottom = '1px solid cyan'
    }

    let children = []
	  nodeChildren.map((n) => {
	    children.push(
	    	<FileBranch
	    		node={n}
	    		key={n.get('path')}
	    		dropFn={dropFn}
	    		onClick={onClick}
	    	/>)
	  })

	  let label = <Label node={node} type={type} startRename={this.startRename} onRename={this.rename} />

    return connectDropTarget(connectDragSource(
      <div style={style} onClick={this.onClick}>

	      <TreeView
	        nodeLabel={label}
	        key={node.get('path')+"-tree"}
	        isDragging={isDragging}
	        openLabel={openLabel}
	        closedLabel={closedLabel}
	        defaultCollapsed={false}>
	        {children}
	      </TreeView>
      </div>
    ));
  }
}

const FileBranch = DropTarget(ItemTypes.FILE, target, (connect, monitor) => {
	return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop()
  };
})(DragSource(ItemTypes.FILE, folderSource, collect)(Branch));

export default FileBranch
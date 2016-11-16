import React, {Component} from 'react';

import { ContextMenuLayer } from "react-contextmenu"; 

class Label extends Component {
	render() {
		let label
		const {
			startRename,
			node,
			type,
			onRename
		} = this.props

		const name = node.get('name')
		if (this.props.renaming) {
			return <span className="node">
				label = <input
	        type="text"
	        value={name}
	        onChange={onRename}
      	/>
			</span>;
		} else {
			label = <span className="node">{name}</span>;
		}
	return (
			<span>
				{label}
			</span>
		)
	}
}

export default ContextMenuLayer("filebranch", (props) => ({
    node: props.node
}))(Label);
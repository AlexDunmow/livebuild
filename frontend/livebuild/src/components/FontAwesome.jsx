import React, {Component} from 'react';

require("font-awesome-webpack");

export default class FontAwesome extends Component{
	render() {
		if (Array.isArray(this.props.name)) {
			return <span style={this.props.style} className="fa-stack">
				{this.props.name.map((name)=>{
					return <i key={name} className={"fa "+name}></i>
				})}
			</span>
		}
		return <span style={this.props.style} className={"fa fa-"+this.props.name} />
	}
}
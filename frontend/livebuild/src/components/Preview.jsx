import React, {Component} from 'react';

export default class FontAwesome extends Component{
	render() {
		return <iframe className="preview" src={this.props.path || "/"} />
	}
}
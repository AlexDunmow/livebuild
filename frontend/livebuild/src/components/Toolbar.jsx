import React, {Component} from 'react';
import logo from '../assets/img/LiveBuild.png'

import ActivityIndicator from 'react-activity-indicator'

export default class Toolbar extends Component {
	constructor(props) {
		super(props)
		this.store = props.store
		this.state = {}
	}
	componentDidMount() {
		this.unsubscribe = this.store.subscribe(() => {
			let ui = this.store.getState().get('ui').toJS()
			this.setState(ui)
		})
	}
	render() {
		return (
		<div className="toolbar" style={{background: "url("+logo+") no-repeat left center" }}>
			{(() => {
				if (this.state.saving) {
					return <div className="indicator">
						<span>Saving... </span>
						<div className="indicator-container">
							<ActivityIndicator activeColor="#F92672" borderRadius="50%" diameter={10} duration={150} />
						</div>
					</div>
				}
			})()}
		</div> 
		)
	}
}
import React, {Component} from 'react';

import RenderInBody from 'react-render-in-body'

export default class Prompt extends Component{
	constructor(props) {
		super(props)
		this.state = {closed:false}
	}
	onMaskClick = (e) => {
		if (e.target !== this.refs.mask) { return }
		if (this.props.onMaskClick) {
			this.props.onMaskClick(this.refs.input.value)
		}
	}
	buttonClickFactory = (fn) => {
		return () => {
			if (fn) {
				return fn(this.refs.input.value)
			}
		}
	}
	render() {
		return (
			<RenderInBody>
				<div className="mask" ref="mask" onClick={this.onMaskClick}>
					<div className="prompt">
						{this.props.text}<br/>
						<input type="text" ref="input" />
						<footer>
							{this.props.buttons.map((btn) => {
								return <button key={btn.text} onClick={this.buttonClickFactory(btn.onClick)}>{btn.text}</button>
							})}
						</footer>
					</div>
				</div>
			</RenderInBody>
		)
	}
}
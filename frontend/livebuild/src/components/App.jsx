
import GoldenLayout from './goldenlayout'
import Editor from './Editor'
import FileViewer from './FileTree'
import RenderInBody from 'react-render-in-body'

import Introduction from './Introduction.jsx'
import Preview from './Preview.jsx'

import {On, Off, Emit} from './Events.js'
import React, {Component} from 'react'
import ReactDOM from 'react-dom';

import ActivityIndicator from 'react-activity-indicator'

import Toolbar from './Toolbar';

import Immutable from 'immutable'
import superagent from 'superagent'

import GetStore from './Store.js'

class AppController extends Component {
	constructor(props) {
		super(props)
		let store = GetStore()
		this.unsubscribe = store.subscribe(() => {
			this.forceUpdate()
		})
	}
	render() {
		let ui = GetStore().getState().get('ui').toJS()
		let mask = null

		if (ui.thinking) {
			mask = <RenderInBody>
				<div className="mask thinking" ref="mask">
					<h2>{ui.thinkingMsg}</h2>
					<ActivityIndicator activeColor="#F92672" borderRadius="50%" diameter={50} duration={150} />
				</div>
			</RenderInBody>
		}
		return (
			<div style={{height:50}}>
				{this.props.children}
				{mask}
			</div>
		)
	}
}

export default class App {
	menuOpen = (node) => {
		this.newEditor(node.get('path'),node.get('name'))
	}
	deleteFile = (node) => {
		let path = node.get('path')
		this.store.dispatch({
			type: "UI",
			key: "thinking",
			msg: "Deleting /"+path,
			action: true
		})
		superagent.del('/build/delete/'+path)
			.end((err, res) => {
				this.store.dispatch({
					type: "UI",
					key: "thinking",
					action: false
				})
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
	nodeClick = (node) => {	
		let path = node.get('path')
		let items = this.layout.root.getItemsById(path)
		if (items.length > 0) {
			items[0].parent.setActiveContentItem(items[0])
			return
		}
		this.newEditor(path, node.get('name'))
	}
	newEditor = (path, name) => {
		let config = {
			title: name,
			type: 'react-component',
			id: path,
			component: 'codemirror',
			props: { path: path }
		};
		let editorsCntr = this.layout.root.getItemsById('editors')[0]
		editorsCntr.addChild( config );
	}
	init = () => {
		this.store = GetStore()
		window.store = this.store

		superagent.get('/build/files')
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

		this.layout = new GoldenLayout({
		 settings: {
        selectionEnabled: true
     },
		 content: [{
			 type: 'row',
			 content:[{
				 type:'react-component',
				 component: 'files',
				 width: 20,
				 title: "Files",
				 isCloseable: false,
				 props: { label: 'Files', store:this.store }
			 },{
				 type: 'stack',
				 id: 'editors',
				 isClosable: false,
				 content:[{
					 title: "Introduction",
					 type:'react-component',
					 component: 'introduction',
					 isClosable: false,
					 props: { path: 'introduction' }
				 },{
					 title: "Preview",
					 type:'react-component',
					 isClosable: false,
					 component: 'preview',
					 props: { path: '/' }
				 }]
			 }]
		 }]
		})
		this.layout.registerComponent( 'introduction', Introduction );
		this.layout.registerComponent( 'codemirror', Editor );
		this.layout.registerComponent( 'files', FileViewer );
		this.layout.registerComponent( 'preview', Preview );

		this.layout.on('itemDestroyed', (item) => {
			
		})
		this.layout.on('stateChanged', (item) => {
			Emit('layoutchange')
		})

		On('nodeclick',this.nodeClick)
		On('menu:open',this.menuOpen)
		On('menu:delete',this.deleteFile)
		On('newfolder',this.newFolder)

		//Once all components are registered, call
		this.layout.init();
		window.layout = this.layout

		ReactDOM.render(
			<AppController><Toolbar store={this.store} /></AppController>,
			document.getElementById('toolbar')
		)
	}
}


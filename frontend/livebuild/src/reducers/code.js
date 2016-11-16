import Immutable, {Map, List} from 'immutable'

let i = 0

function newEditor(state, file) {
	let id = 'open-editor-'+i
	i++ 

	return state.set(id, file.set('id', id))
}

export default (state = Map({components: Map(), code: Map(), unsaved: Map() }), action) => {
	switch(action.type) {
		case "LOAD:CODE":
			return state.set(action.path, action.code)
		case "OPEN:FILE":
			return state.set('components',newEditor(state.get('components'), action.file))
		default:
			return state;
	}
}

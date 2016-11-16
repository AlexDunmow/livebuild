import Immutable, {Map} from 'immutable'

export default (state = Map(), action) => {
	switch(action.type) {
		case "UI":
			switch (action.key) {
				case "thinking":
					state = state.set('thinkingMsg', action.msg)
				default:
					return state.set(action.key, action.action)
			}
		default:
			return state
	}
}

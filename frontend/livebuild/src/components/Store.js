import configureStore from '../reducers/reducers'
import Immutable from 'immutable'
import superagent from 'superagent'

let store = configureStore(Immutable.Map())

export default function() {
	return store
}

let saveTimers = {}
let count = 0

export function deleteFile(path) {
	store.dispatch({
		type: "UI",
		key: "saving",
		action: true
	})
}

export function updateCode(path,code) {
	let ui = store.getState().get('ui').toJS()
  store.dispatch({
      type: "LOAD:CODE",
      path: path,
      code
  });

  if (!ui.saving) {
		setTimeout(() => {
			store.dispatch({
				type: "UI",
				key: "saving",
				action: true
			})
		},1)
	}

  clearTimeout(saveTimers[path])
  saveTimers[path] = setTimeout(() => {
  	count++
    superagent.post('/build/save/'+path)
			.type('form')
			.send({
				code
			})
			.accept('text/plain')
			.end((err, res) => {
				count--
				if (count === 0) {
					store.dispatch({
						type: "UI",
						key: "saving",
						action: false
					})
				}
				if (err) {
					alert(err);
					return
				};
			})
  }, 1000)
}

export function retrieveCode(path) {

	superagent.get('/build/get/'+path)
    .accept('text/plain')
    .send()
    .end((err, res) => {
      if (err) {
        alert(err);
        return
      };

      store.dispatch({
	      type: "LOAD:CODE",
	      path: path,
	      code: res.text || ''
		  });
    }
  );

  return ''

}
export function getCode(path) {
	let code 
	try {
		code = store.getState().get('code').get('path')
	} catch(err) {
		return retrieveCode(path)
	}

	if (typeof code == "undefined") {
		return retrieveCode(path)
	}

	return code

}
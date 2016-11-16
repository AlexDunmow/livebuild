import App from './components/App';

require('file?name=[name].[ext]!./assets/index.html');

import './styles/codemirror.css'
import './styles/vibrant-ink.css'
import './styles/application.css'
import './styles/input.css'
import 'react-ninjatoolbar/src/css/toolbar.css'
import './styles/toolbar.css'
import './assets/fonts/font-mfizz.css'

let app = new App()

app.init()
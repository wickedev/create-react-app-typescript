import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from 'src/App'
import 'src/styles.scss'
import registerServiceWorker from 'src/utils/registerServiceWorker'

ReactDOM.render(
    <App/>,
    document.getElementById('root') as HTMLElement
)
registerServiceWorker()

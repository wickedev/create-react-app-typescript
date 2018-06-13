import App from 'App'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'styles.scss'
import registerServiceWorker from 'utils/registerServiceWorker'

ReactDOM.render(
    <App initialCount={0}/>,
    document.getElementById('root') as HTMLElement
)
registerServiceWorker()

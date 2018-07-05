import App from 'app/App'
import 'app/App/styles.scss'
import registerServiceWorker from 'app/utils/registerServiceWorker'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

ReactDOM.render(
    <App initialCount={0}/>,
    document.getElementById('root') as HTMLElement
)
registerServiceWorker()

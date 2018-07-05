import App from 'app/App'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App initialCount={0}/>, div)
    ReactDOM.unmountComponentAtNode(div)
})

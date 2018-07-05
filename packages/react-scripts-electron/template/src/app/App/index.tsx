import styles from 'app/App/styles.scss'
import logo from 'app/assets/logo.svg'
import {observable} from 'mobx'
import {observer} from 'mobx-react'
import * as React from 'react'

export interface IAppProps {
    initialCount: number
}

@observer
class App extends React.Component<IAppProps> {

    @observable private count: number

    constructor(props: IAppProps) {
        super(props)
        this.count = props.initialCount
    }

    public render() {
        return (
            <div className={styles.app}>
                <header className={styles.header}>
                    <img src={logo} className={styles.logo} alt="logo"/>
                    <h1 className={styles.title}>Welcome to React</h1>
                </header>
                <p className={styles.intro}>
                    To get started, edit <code>src/App.tsx</code> and save to reload.
                </p>
                <div>
                    <button onClick={this.onClickMinus}>-</button>
                    {` ${this.count} `}
                    <button onClick={this.onClickPlus}>+</button>
                </div>
            </div>
        )
    }

    private onClickMinus = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        this.count--
    }

    private onClickPlus = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        this.count++
    }
}

export default App

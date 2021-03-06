import {app, BrowserWindow} from 'electron'
import * as path from 'path'
import * as url from 'url'
// import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

const ENV = process.env.NODE_ENV || 'production'
const DEV_MODE = ENV !== 'production'

let mainWindow: Electron.BrowserWindow | null

function createWindow() {

    const PROTOCOL = process.env.HTTPS === 'true' ? 'https' : 'http'
    const PORT = parseInt(process.env.PORT || '', 10) || 3000
    const HOST = process.env.HOST || '127.0.0.1'

    const appUrl = DEV_MODE
        ? `${PROTOCOL}://${HOST}:${PORT}`
        : url.format({
            pathname: path.join(__dirname, '..', 'app', 'index.html'),
            protocol: 'file:',
            slashes: true
        })

    mainWindow = new BrowserWindow({width: 800, height: 600})
    mainWindow.loadURL(appUrl)

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    //   installExtension(REACT_DEVELOPER_TOOLS)
    //     .then((name) => console.log(`Added Extension:  ${name}`))
    //     .catch((err) => console.log('An error occurred: ', err));
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin' || DEV_MODE) {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

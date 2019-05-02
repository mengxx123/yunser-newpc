import { app, BrowserWindow, globalShortcut, ipcMain, screen, shell, clipboard } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
let fs = require('fs')
let path = require('path')
// fs.readdir('/Users/yunser/Desktop/ysapps', (files) => {
// fs.readdir('/Users/yunser', (files) => {
//     console.log('files', files)
// })

const ipc = require('electron').ipcMain;
//主进程
ipcMain.on('MainMsgFromRender', function (event, arg) {
    console.log(arg)
    // event.sender.send('RenderMsgFromMain',arg)
})


export default class AppUpdater {
    constructor() {
        log.transports.file.level = 'info';
        autoUpdater.logger = log;
        autoUpdater.checkForUpdatesAndNotify();
    }
}

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
}

if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
) {
    require('electron-debug')();
}

const installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

    return Promise.all(
        extensions.map(name => installer.default(installer[name], forceDownload))
    ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('open-file', (e, path) => {
    alert('open file')
})

app.on('ready', async () => {
    if (
        process.env.NODE_ENV === 'development' ||
        process.env.DEBUG_PROD === 'true'
    ) {
        // await installExtensions();
    }

    var size = screen.getPrimaryDisplay().workAreaSize;
    console.log('size', size)

    let width = 1000
    let height = 640

    let x = (size.width - width) / 2
    let y = (size.height - height) / 2
    mainWindow = new BrowserWindow({
        show: false,
        // x,
        // y,
        width,
        height,
        // frame: false,
        webPreferences: {
            // devTools: false
        }
    });

    ipc.on('news', function () { //news 是自定义的命令 ，只要与页面发过来的命令名字统一就可以
        //接收到消息后的执行程序
        console.log('get msg and send news2')
        // ipc.send('news2')
        // shell.openItem('/Users/yunser/Desktop/export.json');
        shell.openItem('/Applications/Calendar.app');

        // mainWindow.setBounds({
        //   x: 0,
        //   y: 225,
        //   width: 400,
        //   height: 400
        // })
    })
    ipc.on('openPlugin', function () {
        shell.showItemInFolder(path.resolve(__dirname, '..', 'apps/README.md'))
    })
    ipc.on('getApps', function () { //news 是自定义的命令 ，只要与页面发过来的命令名字统一就可以
        //接收到消息后的执行程序
        console.log('get msg and send news2')
        let plugins = []
        let pluginRoot = path.resolve(__dirname, '..', 'apps')
        let files = fs.readdirSync(pluginRoot)
        console.log('fs', files)
        function exists(path){  
            return fs.existsSync(path) || path.existsSync(path);  
       }  
        function isDir(path){  
            return exists(path) && fs.statSync(path).isDirectory();  
        }  
        for (let fileName of files) {
            // if (!fileName.match(/^\./)) {
            if (fileName !== '.DS_Store' && isDir(path.resolve(pluginRoot, fileName))) {
                let filePath = path.resolve(pluginRoot, fileName, 'plugin.json')
                let fileContent = fs.readFileSync(filePath, 'utf-8')
                console.log('fileContent', fileContent)
                let plugin = JSON.parse(fileContent)
                plugins.push({
                    name: plugin.pluginName,
                    path: path.resolve(pluginRoot, fileName, plugin.main)
                })
            }
        }
        console.log('plugins', plugins)
        webContents.send('getAppsSuccess', plugins)
    })

    let webContents = mainWindow.webContents

    // ipc.on('openUrl', function (url) {
    //   console.log('openUrl'), url
    //   // shell.openExternal(url)
    // })
    ipcMain.on('openUrl', function (event, arg) {
        console.log('openUrl2', event, arg)
        shell.openExternal(arg)
    })
    ipcMain.on('getClipboard', function (event, arg) {
        console.log('getClipboard', event, arg)
        // shell.openExternal(arg)
        const rawFilePath = clipboard.readBuffer('FileNameW').toString('ucs2');
        let filePath = rawFilePath.replace(new RegExp(String.fromCharCode(0), 'g'), '');
        console.log('filePath', filePath)
        // event.sender.send('RenderMsgFromMain',arg)
        webContents.send('filePath', filePath)
    })



    let ret = globalShortcut.register('CommandOrControl+Space', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide()
        } else {
            mainWindow.show()
            mainWindow.focus()
            webContents.send('focus')
        }
        console.log('CommandOrControl+Space is pressed')
    })
    if (!ret) {
        console.log('registration failed')
    }

    // 检查快捷键是否注册成功
    console.log(globalShortcut.isRegistered('CommandOrControl+Space'))

    mainWindow.loadURL(`file://${__dirname}/app.html`);

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    mainWindow.webContents.on('did-finish-load', () => {
        if (!mainWindow) {
            throw new Error('"mainWindow" is not defined');
        }
        if (process.env.START_MINIMIZED) {
            mainWindow.minimize();
        } else {
            mainWindow.show();
            mainWindow.focus();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater();
});

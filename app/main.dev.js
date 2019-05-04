import { app, BrowserWindow, globalShortcut, ipcMain, screen, shell, clipboard, remote, Menu, Tray,
    systemPreferences } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
const nedb = require('nedb');
let fs = require('fs')
let path = require('path')
const request = require('request')
const unzip = require('unzip')

function downloadUrl(url, filePath) {
    return new Promise((resolve, reject) => {
        var writeStream = fs.createWriteStream(filePath);
        var readStream = request(url)
        readStream.pipe(writeStream)
        readStream.on('end', function(response) {
            console.log('文件写入成功')
            writeStream.end()
        })

        writeStream.on("finish", function() {
            console.log("ok")
            resolve()
        });
    })
}


// 实例化连接对象（不带参数默认为内存数据库）
// const db = new nedb({
//     // filename: '/data/yunser-pc.db',
//     // autoload: true
// });

//   // 插入单项
// db.insert({
//     name: 'tom'
// }, (err, ret) => {
//     if (err) {
//         console.error('123')
//         return
//     }
//     db.findOne({
//         name: 'tom'
//     }, (err, ret) => {
//         if (err) {
//             console.error('123')
//             return
//         }
//         console.log('find', ret)
//     });
// });


// fs.readdir('/Users/yunser/Desktop/ysapps', (files) => {
// fs.readdir('/Users/yunser', (files) => {
//     console.log('files', files)
// })

// let configDir = remote.app.getPath('userData');

// console.log('configDir',  configDir)

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
let appDataPath = app.getPath('appData')
let userDataPath = path.resolve(appDataPath, 'yunser')
console.log('userDataPath', userDataPath)
let isExit = fs.existsSync(userDataPath)
if (!isExit) {
    console.log('创建', userDataPath)
    fs.mkdirSync(userDataPath)
}
let pluginPath = path.resolve(userDataPath, 'plugins')
isExit = fs.existsSync(pluginPath)
if (!isExit) {
    console.log('创建', pluginPath)
    fs.mkdirSync(pluginPath)
}
console.log('pluginPath', pluginPath)

fs.createReadStream(path.resolve(userDataPath, 'test.zip')).pipe(unzip.Extract({ path: path.resolve(userDataPath, 'test') }))

// let unzip_extract = unzip.Extract({
//     path: path.resolve(userDataPath, 'test')
// })
// //监听解压缩、传输数据过程中的错误回调
// unzip_extract.on('error',(err)=>{
//     console.error('解压错误')
// })
// //监听解压缩、传输数据结束
// unzip_extract.on('finish',()=>{
//     console.log('解压完成')
// })
// //创建可读文件流，传输数据
// fs.createReadStream(zip_path).pipe(path.resolve(userDataPath, 'test.zip'))

// async function downFileTest() {
//     await downloadUrl('http://img1.yunser.net/all.zip', path.resolve(userDataPath, 'test.zip'))
// }
// downFileTest()

app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    // if (process.platform !== 'darwin') {
    //     app.quit();
    // }
});

app.on('open-file', (e, path) => {
    alert('open file')
})

const template = [
    {
      label: '编辑',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: '测试',
      submenu: [
        {
            label: '退出插件',
            accelerator: 'Escape',
            click() {
                createWindow()
            }
        },
        {
            label: '更多',
            click () { require('electron').shell.openExternal('https://electronjs.org') }
        },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // {
    //   role: 'window',
    //   submenu: [
    //     { role: 'minimize' },
    //     { role: 'close' }
    //   ]
    // },
    // {
    //   role: 'help',
    //   submenu: [
    //     {
    //       label: 'Learn More',
    //       click () { require('electron').shell.openExternal('https://electronjs.org') }
    //     }
    //   ]
    // }
  ]
  

function createWindow(url) {

    var size = screen.getPrimaryDisplay().workAreaSize;
    console.log('size', size)

    let width = 1200
    let height = 640

    let x = (size.width - width) / 2
    let y = (size.height - height) / 2

    if (mainWindow) {
        mainWindow.destroy()
    }
    mainWindow = new BrowserWindow({
        show: false,
        // x,
        // y,
        width,
        height,
        // frame: false,
        webPreferences: {
            contextIsolation: url ? true : false, // 不然
            devTools: false
        },
        nodeIntegration: false,
        // skipTaskbar: true
    });
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

    mainWindow.on('close', (event) => {
        // event.preventDefault();
        // mainWindow.hide()
        app.quit()
        // mainWindow.destroy()

        // mainWindow.setSkipTaskbar(true)
    })
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    // app.on('before-quit', function (){

    //     mainWindow.hide();
    // });

    mainWindow.on('blur', (event) => {
        mainWindow.hide()
    })
    if (url) {
        mainWindow.loadURL(url) 
    } else {
        mainWindow.loadURL(`file://${__dirname}/app.html`);
        // mainWindow.loadURL(`/Users/yunser/app/yunser-newpc/apps/simple-plugin/index.html`);
    }
}
  
app.on('ready', async () => {
    if (
        process.env.NODE_ENV === 'development' ||
        process.env.DEBUG_PROD === 'true'
    ) {
        // await installExtensions();
    }

    
    
    createWindow()

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
    ipc.on('getAppFolder', function () {
        console.log('send debug')
        mainWindow.webContents.send('debug', path.resolve(__dirname, '..', 'apps'))
    })
    ipc.on('openPath', function (ecent, path) {
        console.log('send debug')
        shell.showItemInFolder(path)
    })
    
    ipc.on('openDevTools', function () {
        console.log('send debug')
        mainWindow.webContents.openDevTools()
        // webContents.send('debug', path.resolve(__dirname, '..', 'apps'))
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
                // console.log('fileContent', fileContent)
                let plugin = JSON.parse(fileContent)
                if (plugin.type === 'iframe') {
                    plugins.push({
                        name: plugin.pluginName,
                        path: plugin.url
                    })
                } else {
                    plugins.push({
                        name: plugin.pluginName,
                        path: 'file://' + path.resolve(pluginRoot, fileName, plugin.main)
                    })
                }
            }
        }
        console.log('plugins', plugins)
        mainWindow.webContents.send('getAppsCallback', plugins)
    })

    // ipc.on('openUrl', function (url) {
    //   console.log('openUrl'), url
    //   // shell.openExternal(url)
    // })
    ipcMain.on('openUrl', function (event, arg) {
        console.log('openUrl2', arg)
        shell.openExternal(arg)
    })
    ipcMain.on('openApp', function (event, arg) {
        // mainWindow.loadURL(arg)
        createWindow(arg)
    })
    
    ipcMain.on('getClipboard', function (event, arg) {
        // https://blog.csdn.net/weixin_34167043/article/details/86853046
        console.log('getClipboard', arg)
        // console.log('platform', process.platform)
        // shell.openExternal(arg)
        let filePath
        if (process.platform === 'darwin') {
            filePath = clipboard.read('public.file-url').replace('file://', '');
        } else {
            const rawFilePath = clipboard.readBuffer('FileNameW').toString('ucs2');
            filePath = rawFilePath.replace(new RegExp(String.fromCharCode(0), 'g'), '');
        }
        console.log('filePath', filePath)
        // event.sender.send('RenderMsgFromMain',arg)
        mainWindow.webContents.send('getClipboardCallback', filePath ? {
            type: 'file',
            data: filePath
        } : {
            type: 'text',
            data: clipboard.readText()
        })
    })
    ipcMain.on('setClipboard', function (event, arg) {
        console.log('setClipboard', arg)
        clipboard.writeText(arg)
        mainWindow.webContents.send('setClipboardSuccess')
    })



    // let ret = globalShortcut.register('CommandOrControl+Space', () => {
    let ret = globalShortcut.register('Option+Space', () => {
        // if (mainWindow.isVisible()) {
        if (mainWindow.isFocused()) {
            mainWindow.hide()
        } else {
            mainWindow.show()
            mainWindow.focus()
            mainWindow.webContents.send('focus', clipboard.readText())
        }
        console.log('Option+Space is pressed')
    })
    if (!ret) {
        console.log('registration failed')
    }

    // 检查快捷键是否注册成功
    console.log(globalShortcut.isRegistered('Option+Space'))

    

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    
    app.on('activate', (event) => {
        mainWindow.show()
    })
    

    const menu2 = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu2)

    // const menuBuilder = new MenuBuilder(mainWindow);
    // menuBuilder.buildMenu();

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    

    // console.log('tray', path.resolve(__dirname, '..', 'resources/icon.ico'))

    

    // appIcon = new Tray(path.resolve(__dirname, '..', 'resources/icon.ico'))
    let appIcon
    try {

        appIcon = new Tray(path.resolve(__dirname, '..', 'resources/icons/16x16.png'))
    } catch (err) {
        console.error('err', err)
    }
    const contextMenu = Menu.buildFromTemplate([
        { 
            label: '显示/隐藏',
            // type: 'radio',
            click(menuItem, event) {
                if (mainWindow.isFocused()) {
                    mainWindow.hide()
                } else {
                    mainWindow.show()
                    mainWindow.focus()
                    mainWindow.webContents.send('focus')
                }
            }
        },
        {
            // label: 'Item2',
            type: 'separator'
        },
        {
            label: 'Item2',
            type: 'radio'
        },
        {
            type: 'separator'
        },
        {
            label: '帮助文档',
            click() {
                shell.openExternal('https://project.yunser.com/products/14bbdc006cbf11e99c8c45c3bde14969')
            }
        },
        {
            type: 'separator'
        },
        {
            label: '退出',
            accelerator: 'Command+Q',
            click() {
                // window.destroy()
                mainWindow = null
                app.quit()
            }
        },

        
    ])

    // mainWindow.setProgressBar(2)


    // Make a change to the context menu
    contextMenu.items[1].checked = false

    
    appIcon.setContextMenu(contextMenu)

    const dockMenu = Menu.buildFromTemplate([
        {
          label: 'New Window',
          click () { console.log('New Window') }
        }, {
          label: 'New Window with Settings',
          submenu: [
            { label: 'Basic' },
            { label: 'Pro' }
          ]
        },
        { label: 'New Command...' }
      ])
      
      app.dock.setMenu(dockMenu)

    new AppUpdater();
});

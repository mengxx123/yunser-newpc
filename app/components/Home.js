// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import routes from '../constants/routes'
import styles from './Home.scss'
import classnames from 'classnames'
const electron = require('electron')
const ipc = require('electron').ipcRenderer;
const ipcRenderer = electron.ipcRenderer

export default class Home extends Component {

  // props: Props;

  state = {
    number: 1,
    suggestions: [],
    activeIndex: 2,
    activeTabIndex: 1,
    apps: []
  }

  componentDidMount() {
    const setState = value => this.setState(value)

    ipc.on('news2', function() {
      console.log('get news2')
    })
    ipcRenderer.on('focus', function(event, message) {
      console.log('on focus')
      document.querySelector('input').focus()
    })

    ipcRenderer.on('getAppsSuccess', function(event, message) {
      console.log('getAppsSuccess', message)
      setState({
        apps: message
      })
      // document.querySelector('input').focus()
    })

    ipcRenderer.send('getApps')

    // ipcRenderer.on('getPlugin', function(event, message) {
    //   console.log('on focus')
    //   document.querySelector('input').focus()
    // })

    // // https://www.baidu.com/
    // let url = 'file:///C:/Users/Y700/Desktop/utools/index.html'
    // document.querySelector('#webview-box').innerHTML = `<webview class="webview" src="${url}" />`
    // const webview = document.querySelector('webview')
    // webview.addEventListener('dom-ready', () => {
    //   // webview.openDevTools()
    // })
  }


  render() {
    const { number, suggestions, activeIndex, activeTabIndex, apps } = this.state

    let onClick = () => {
      console.log('sended')
      ipcRenderer.send('news', 'hellow')
      // ipcRenderer.send('MainMsgFromRender','hellow')
    }

    let urls = [
      {
        type: 'url',
        title: '百度一下',
        icon: 'https://life.yunser.com/static/img/baidu.svg',
        url: 'https://www.baidu.com/'
      },
      {
        type: 'url',
        title: '百度两下',
        icon: 'https://life.yunser.com/static/img/baidu.svg',
        url: 'https://www.baidu.com/'
      },
      {
        type: 'url',
        title: '百度三下',
        icon: 'https://life.yunser.com/static/img/baidu.svg',
        url: 'https://www.baidu.com/'
      }
    ]

    function getSuggestion(value) {
      if (!value) {
        return []
      }
      let results = []
      for (let item of urls) {
        if (item.url.includes(value)) {
          results.push({
            ...item,
            description: item.url
          })
        }
      }
      return results
    }

    let clickItem = item => {
      if (item.type === 'url') {
        console.log('open', item.url)
        ipcRenderer.send('openUrl', item.url)
      }
    }

    function getClipboard() {
      ipcRenderer.send('getClipboard')
    }

    const SuggestItem = (item, index) => {
      return (
        <div className={classnames(styles.item, {[styles.active]: activeIndex === index})} onClick={() => clickItem(item)}>
          <img className={styles.icon} src={item.icon} />
          <div>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.description}>{item.description}</div>
          </div>
        </div>
      )
    }

    const setState = value => this.setState(value)

    function onKeyDown(e) {
      console.log(e.keyCode)

      if (e.keyCode === 13) {
        alert(e.target.value)
      }
      if (e.keyCode === 38) {
        // alert(e.target.value)
        let newActiveIndex = activeIndex - 1
        if (newActiveIndex < 0) {
          newActiveIndex = suggestions.length - 1
        }
        console.log('newActiveIndex', newActiveIndex)
        setState({
          activeIndex: newActiveIndex
        })
      }
      if (e.keyCode === 40) {
        // alert(e.target.value)
        let newActiveIndex = activeIndex + 1
        if (newActiveIndex === suggestions.length) {
          newActiveIndex = 0
        }
        console.log('newActiveIndex', newActiveIndex)
        setState({
          activeIndex: newActiveIndex
        })
      }
    }

    let onInput = (e) => {
      console.log(e.target.value)
      this.setState({
        suggestions: getSuggestion(e.target.value)
      })
    }

    let onTabChange = (index) => {
      if (index === 5) {
        console.error('block')
        document.querySelector('#webview-box2').style.display = 'block'
      } else {
        console.error('none')
        document.querySelector('#webview-box2').style.display = 'none'
      }
      setState({
        activeTabIndex: index
      })
    }

    // let apps = [
    //   {
    //     name: 'helloWorld',
    //     path: 'file:///Users/yunser/Desktop/ysapps/simple-plugin/index.html'
    //   },
    //   {
    //     name: 'helloWorld2',
    //     path: 'file:///Users/yunser/Desktop/ysapps/simple-plugin2/index.html'
    //   }
    // ]

    function openApp(item) {
      setState({
        activeTabIndex: 5
      })

          // https://www.baidu.com/
          document.querySelector('#webview-box2').style.display = 'block'
      document.querySelector('#webview-box2').innerHTML = `
      <div class="webviewBox" id="webview-box">
        <webview class="webview" src="${item.path}"></webview>
        <div class="webviewClose" id="webviewClose">关闭</div>
      </div>
      `
      const webview = document.querySelector('webview')
      webview.addEventListener('dom-ready', () => {
        // webview.openDevTools()
      })
      document.getElementById('webviewClose').addEventListener('click', () => {
        document.querySelector('#webview-box2').innerHTML = ''
      })
      
    }

    function AppItem(item, index) {
      return <div key={item.id || index}>
        <div onClick={e => openApp(item)}>{item.name}</div>
      </div>
    }
    const AppList = (
      <ul className={styles.appList}>
        {apps.map(AppItem)}
      </ul>
    )

    function refresh() {
      ipcRenderer.send('getApps')
    }

    function openAppFolder() {
      ipcRenderer.send('openPlugin')
    }

    return (
      <div className={styles.page} data-tid="container">
        {/* <div className={styles.searchBox}>
          <input id="input" className={styles.input} placeholder="搜索" onInput={onInput} onKeyDown={onKeyDown} />
          <div className={styles.icon}>U</div>
        </div> */}
        {suggestions.length > 0 &&
          <div className={styles.suggestList}>
            {suggestions.map(SuggestItem)}
          </div>
        }
        <div className={styles.appbar}>
          <ul className={styles.tabList}>
            {/* <li className={classnames(styles.tabItem, {[styles.active]: activeTabIndex === 0})}>主页</li> */}
            <li className={classnames(styles.tabItem, {[styles.active]: activeTabIndex === 1})} onClick={e => onTabChange(1)}>我的应用</li>
            {/* <li className={classnames(styles.tabItem, {[styles.active]: activeTabIndex === 2})} onClick={e => onTabChange(2)}>应用市场</li> */}
            <li className={classnames(styles.tabItem, {[styles.active]: activeTabIndex === 3})} onClick={e => onTabChange(3)}>设置</li>
            <li className={classnames(styles.tabItem, {[styles.active]: activeTabIndex === 4})} onClick={e => onTabChange(4)}>开发</li>
            <li className={classnames(styles.tabItem, {[styles.active]: activeTabIndex === 5})} onClick={e => onTabChange(5)}>插件</li>
          </ul>
        </div>
        <div className={styles.body}>
          {activeTabIndex === 1 &&
            <div className={styles.tabContent}>
              <button className="ui-btn" onClick={openAppFolder}>打开插件目录</button>
              <button className="ui-btn" onClick={refresh}>刷新</button>
              {/* <h2 className={styles.all}>所有插件</h2> */}
              {AppList}
              {/* <div className={styles.appEmpty}>没有应用，去应用市场瞧一瞧~</div> */}
            </div>
          }
          {activeTabIndex === 2 &&
            <div className={styles.tabContent}>
              <button className="ui-btn" onClick={openAppFolder}>打开插件目录</button>
              <button className="ui-btn" onClick={refresh}>刷新</button>
            </div>
          }
          {activeTabIndex === 3 &&
            <div className={styles.tabContent}>
              <div className={styles.appEmpty}>功能正在开发中...</div>
            </div>
          }
          {activeTabIndex === 4 &&
            <div className={styles.tabContent}>
              
              {/* <div className="article">
                <h2>插件开发入门</h2>
                <ol>
                  <li></li>
                </ol>

              </div> */}
              <div className={styles.appEmpty}>功能正在开发中...</div>
            </div>
          }
          {/* <button onClick={getClipboard}>获取剪切板内容</button>
          <h2>这是首页，啦啦啦</h2> */}
          <div id="webview-box2"></div>
          {/* <webview className={styles.webview} src="https://www.baidu.com/" /> */}
          {/* {number}
          <button onClick={onClick}>测试</button>
          <Link to={routes.COUNTER}>to Counter</Link> */}
        </div>
      </div>
    );
  }
}

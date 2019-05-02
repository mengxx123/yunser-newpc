// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import routes from '../constants/routes'
import styles from './Home.scss'
import classnames from 'classnames'
const electron = require('electron')
const ipc = require('electron').ipcRenderer;
const ipcRenderer = electron.ipcRenderer

type Props = {};

export default class Home extends Component<Props> {

  props: Props;

  state = {
    number: 1,
    suggestions: [],
    activeIndex: 0
  }

  componentDidMount() {
    ipc.on('news2', function() {
      console.log('get news2')
    })
    ipcRenderer.on('focus', function(event, message) {
      console.log('on focus')
      document.querySelector('input').focus()
    })

    // https://www.baidu.com/
    let url = 'file:///C:/Users/Y700/Desktop/utools/index.html'
    // let url = 'file:\\\yunser\\\yunser-newpc\\\simple-plugin'
    document.querySelector('#webview-box').innerHTML = `<webview class="webview" src="${url}" />`
    const webview = document.querySelector('webview')
    webview.addEventListener('dom-ready', () => {
      // webview.openDevTools()
    })
  }

  render() {
    const { number, suggestions, activeIndex } = this.state

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

    return (
      <div className={styles.page} data-tid="container">
        <div className={styles.searchBox}>
          <input id="input" className={styles.input} placeholder="搜索" onInput={onInput} onKeyDown={onKeyDown} />
          <div className={styles.icon}>U</div>
        </div>
        {suggestions.length > 0 &&
          <div className={styles.suggestList}>
            {suggestions.map(SuggestItem)}
          </div>
        }
        <div className={styles.appbar}>
          <ul className={styles.tabList}>
            <li className={styles.tabItem}>我的应用</li>
            <li className={styles.tabItem}>应用市场</li>
            <li className={styles.tabItem}>设置</li>
          </ul>
        </div>
        <div className={styles.body}>
          <button onClick={getClipboard}>获取剪切板内容</button>
          <h2>这是首页，啦啦啦</h2>
          <div id="webview-box"></div>
          {/* <webview className={styles.webview} src="https://www.baidu.com/" /> */}
          {number}
          <button onClick={onClick}>测试</button>
          <Link to={routes.COUNTER}>to Counter</Link>
        </div>
      </div>
    );
  }
}

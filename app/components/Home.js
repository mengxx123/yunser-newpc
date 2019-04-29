// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import routes from '../constants/routes'
import styles from './Home.scss'
const electron = require('electron')
const ipc = require('electron').ipcRenderer;
const ipcRenderer = electron.ipcRenderer

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  state = {
    number: 1
  }

  componentDidMount() {
    ipc.on('news2', function() {
      console.log('get news2')
    })
  }

  render() {
    const { number } = this.state

    let onClick = () => {
      ipcRenderer.send('MainMsgFromRender','hellow')
              //接收

      // this.setState({
      //   number: number + 1
      // })
    }

    return (
      <div className={styles.page} data-tid="container">
        <div className={styles.appbar}>
          <ul className={styles.tabList}>
            <li className={styles.tabItem}>我的应用</li>
            <li className={styles.tabItem}>应用市场</li>
            <li className={styles.tabItem}>设置</li>
          </ul>
        </div>
        <h2>这是首页，啦啦啦</h2>
        {/* <webview id="foo" src="https://www.github.com/" style="display:inline-flex; width:640px; height:480px"></webview> */}

        {number}
        <button onClick={onClick}>测试</button>
        <Link to={routes.COUNTER}>to Counter</Link>
      </div>
    );
  }
}

// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import routes from '../constants/routes'
import styles from './Home.scss'
import classnames from 'classnames'
const electron = require('electron')
const ipc = require('electron').ipcRenderer;
const ipcRenderer = electron.ipcRenderer

function sendMessage(eventName, data, callback) {
  ipcRenderer.on(eventName + 'Callback', function(event, message) {
    callback(message)
  })
  ipcRenderer.send(eventName, data)
}


function isPath(path) {
  if (path.match(/^\/([\w\W+]\/?)+$/)) {
    return true
  }
  return false
}

console.log('===isPath', isPath('/assas/asasas?'))

function convertCurrency(currencyDigits) { 
  // Constants: 
      var MAXIMUM_NUMBER = 99999999999.99; 
      // Predefine the radix characters and currency symbols for output: 
      var CN_ZERO = "零"; 
      var CN_ONE = "壹"; 
      var CN_TWO = "贰"; 
      var CN_THREE = "叁"; 
      var CN_FOUR = "肆"; 
      var CN_FIVE = "伍"; 
      var CN_SIX = "陆"; 
      var CN_SEVEN = "柒"; 
      var CN_EIGHT = "捌"; 
      var CN_NINE = "玖"; 
      var CN_TEN = "拾"; 
      var CN_HUNDRED = "佰"; 
      var CN_THOUSAND = "仟"; 
      var CN_TEN_THOUSAND = "万"; 
      var CN_HUNDRED_MILLION = "亿"; 
      var CN_SYMBOL = ""; 
      var CN_DOLLAR = "元"; 
      var CN_TEN_CENT = "角"; 
      var CN_CENT = "分"; 
      var CN_INTEGER = "整"; 
       
  // Variables: 
      var integral;    // Represent integral part of digit number. 
      var decimal;    // Represent decimal part of digit number. 
      var outputCharacters;    // The output result. 
      var parts; 
      var digits, radices, bigRadices, decimals; 
      var zeroCount; 
      var i, p, d,ds; 
      var quotient, modulus; 
       
  // Validate input string: 
      currencyDigits = currencyDigits.toString(); 
      if (currencyDigits == "") { 
          alert("不能为空 请输入数字金额!如：123.23"); 
          return ""; 
      } 
      if (currencyDigits.match(/[^,.\d]/) != null) { 
          alert("输入字符串中的字符无效!"); 
          return ""; 
      } 
      if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) { 
          alert("请输入正确的数字金额!"); 
          return ""; 
      } 
       
  // Normalize the format of input digits: 
      currencyDigits = currencyDigits.replace(/,/g, "");    // Remove comma delimiters. 
      currencyDigits = currencyDigits.replace(/^0+/, "");    // Trim zeros at the beginning. 
      // Assert the number is not greater than the maximum number. 
      if (Number(currencyDigits) > MAXIMUM_NUMBER) { 
          alert("Too large a number to convert!"); 
          return ""; 
      } 
       
  // Process the coversion from currency digits to characters: 
      // Separate integral and decimal parts before processing coversion: 
      parts = currencyDigits.split("."); 
      if (parts.length > 1) { 
          integral = parts[0]; 
          decimal = parts[1]; 
          // Cut down redundant decimal digits that are after the second. 
          decimal = decimal.substr(0, 2); 
      } 
      else { 
          integral = parts[0]; 
          decimal = ""; 
      } 
      // Prepare the characters corresponding to the digits: 
      digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE); 
      radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND); 
      bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION); 
      decimals = new Array(CN_TEN_CENT, CN_CENT); 
      // Start processing: 
      outputCharacters = ""; 
      // Process integral part if it is larger than 0: 
      if (Number(integral) > 0) { 
          zeroCount = 0; 
          for (i = 0; i < integral.length; i++) { 
              p = integral.length - i - 1; 
              d = integral.substr(i, 1); 
              quotient = p / 4; 
              modulus = p % 4; 
              if (d == "0") { 
                  zeroCount++; 
              } 
              else { 
                  if (zeroCount > 0) 
                  { 
                      outputCharacters += digits[0]; 
                  } 
                  zeroCount = 0; 
                  outputCharacters += digits[Number(d)] + radices[modulus]; 
              } 
              if (modulus == 0 && zeroCount < 4) { 
                  outputCharacters += bigRadices[quotient]; 
              } 
          } 
          outputCharacters += CN_DOLLAR; 
      } 
      // Process decimal part if there is: 
      if (decimal != "") { 
          for (i = 0; i < decimal.length; i++) { 
              d = decimal.substr(i, 1); 
              ds=decimal.substr(-1, 1);
        if(d==0){
          if(ds==0){
            outputCharacters += "";
            }
          else{
          outputCharacters += digits[Number(d)];
          }
          }
        else{
          
        outputCharacters += digits[Number(d)] + decimals[i];
        
        }
          } 
      } 
      // Confirm and return the final output string: 
      if (outputCharacters == "") { 
          outputCharacters = CN_ZERO + CN_DOLLAR; 
      } 
      if (decimal == "") { 
          outputCharacters += CN_INTEGER; 
      } 
      outputCharacters = CN_SYMBOL + outputCharacters; 
      return outputCharacters; 
} 

console.log('convertCurrency', convertCurrency(112))

  
export default class Home extends Component {

  // props: Props;

  state = {
    number: 1,
    suggestions: [],
    activeIndex: 2,
    activeTabIndex: 1,
    apps: [],
    keyword: '',
    inputFilePath: '',
    inputFileName: ''
  }

  showSuggestion() {
    const { number, suggestions, activeIndex, activeTabIndex, apps, keyword, inputFileName, inputFilePath } = this.state
    const setState = value => this.setState(value)

    console.log('showSuggestion', inputFileName)
    let urls = [
      {
        type: 'url',
        title: '百度一下',
        // icon: 'https://life.yunser.com/static/img/baidu.svg',
        icon: 'https://work.yunser.com/static/img/nav.svg',
        url: 'https://www.baidu.com/'
      },
      {
        type: 'url',
        icon: 'https://work.yunser.com/static/img/nav.svg',
        title: '百度翻译',
        url: 'https://fanyi.baidu.com/'
      },
      {
        type: 'url',
        title: '知乎',
        icon: 'https://work.yunser.com/static/img/nav.svg',
        url: 'https://www.zhihu.com/'
      },
      {
        type: 'url',
        title: 'NiceTool',
        icon: 'https://work.yunser.com/static/img/nav.svg',
        url: 'http://www.nicetool.net/'
      },
      // {
      //   type: 'url',
      //   title: '百度两下',
      //   icon: 'https://life.yunser.com/static/img/baidu.svg',
      //   url: 'https://www.baidu.com/'
      // },
      // {
      //   type: 'url',
      //   title: '百度三下',
      //   icon: 'https://life.yunser.com/static/img/baidu.svg',
      //   url: 'https://www.baidu.com/'
      // }
    ]

    let plugins = [
      {
        id: 'p_1',
        keyword: 'about',
        type: 'url',
        title: '关于',
        url:  'https://project.yunser.com/products/14bbdc006cbf11e99c8c45c3bde14969',
        icon: 'https://app.yunser.com/static/img/extension.svg',
        description: '',
      },
      {
        id: 'p_2',
        keyword: 'help',
        type: 'url',
        title: '帮助',
        url:  'https://project.yunser.com/products/14bbdc006cbf11e99c8c45c3bde14969',
        icon: 'https://app.yunser.com/static/img/extension.svg',
        description: '',
      },
      {
        id: 'p_3',
        keyword: '',
        title: '复制到剪切板',
        match: 'TEXT',
        icon: 'https://app.yunser.com/static/img/extension.svg',
        description: '',
        handler(value) {
          sendMessage('setClipboard', value, messgae => {
            alert('已复制')
          })
        }
      },
      {
        id: 'p_4',
        keyword: 'dx',
        title: '英文大写',
        match(value) {
          return value.match(/[a-zA-z]/) ? 1 : 0

        },
        icon: 'https://app.yunser.com/static/img/extension.svg',
        description: '转换成大写并复制到剪切板',
        handler(value) {
          sendMessage('setClipboard', value.toUpperCase(), messgae => {
            alert('已复制')
          })
        }
      },
      {
        id: 'p_5',
        keyword: 'rmb',
        title: '人民币大写',
        match(value) {
          return value.match(/^[\d.]+$/) ? 10 : 0
        },
        icon: 'https://app.yunser.com/static/img/extension.svg',
        description: '转换成大写金额并复制到剪切板',
        handler(value) {
          sendMessage('setClipboard', convertCurrency(parseFloat(value)), messgae => {
            alert('已复制')
          })
        }
      },
      {
        id: 'p_6',
        keyword: 'rmb',
        title: '前往文件夹',
        match(value) {
          return isPath(value) ? 1 : 0
        },
        icon: 'https://app.yunser.com/static/img/extension.svg',
        description: '',
        handler(value) {
          sendMessage('openPath', value, messgae => {
            // alert('已复制')
          })
        }
      },
    ]

    function getSuggestion(value) {

      let results = []
      if (inputFileName) {
        results.push({
          type: 'plugin',
          id: 'p_copy_path',
          // keyword: '',
          title: '复制路径',
          // match: 'TEXT',
          icon: 'https://app.yunser.com/static/img/extension.svg',
          // description: '复制文件路径到剪切板',
          description: inputFilePath,
          handler(value) {
            sendMessage('setClipboard', inputFilePath, messgae => {
              // alert('已复制')
            })
            setState({
              inputFileName: ''
            })
          }
        })
        return results
      }
      if (!value) {
        return []
      }
      
      for (let item of urls) {
        if (item.url.includes(value)) {
          results.push({
            ...item,
            description: item.url
          })
        }
      }
      
      
      let searchs = [
        {
          keyword: 'bd',
          title: '在百度搜索「{keyword}」',
          // icon: 'https://life.yunser.com/static/img/baidu.svg',
          url: 'https://www.baidu.com/s?wd={keyword}'
        },
        // {
        //   keyword: 'bd',
        //   title: '在百度搜索「{keyword}」',
        //   url: 'https://www.baidu.com/s?wd={query}'
        // },
        {
          keyword: 'google',
          title: '在谷歌搜索「{keyword}」',
          url: 'https://www.google.com/search?q={keyword}'
        },
        {
          keyword: 'zhihu',
          title: '在知乎搜索「{keyword}」',
          url: `https://www.zhihu.com/search?q={keyword}&type=content`,
        },
        {
          keyword: 'sogou',
          title: '在搜狗搜索「{keyword}」',
          url: `https://www.sogou.com/web?query={keyword}`,
        },
        {
          keyword: 'baidu',
          title: '在百度搜索「{keyword}」',
          url: 'https://www.baidu.com/s?wd={keyword}'
        },
      ]
      if (value.match(/^http(s)?:\/\//)) {
        results.push({
          type: 'url',
          title: '默认浏览器打开网址',
          icon: 'https://network.yunser.com/static/img/network.svg',
          description: value,
          url: value
        })
      } else {
        function removeFirst(text) {
          if (!text.match(/\s/)) {
              return ''
          }
          return text.replace(/^[\d\D]+?\s+/, '')
        }

        let theKey = value.split(/\s/)[0]
        let restText = removeFirst(value).replace(/^\s+/, '').replace(/\s+$/, '')
        // 加载插件
        let item = plugins.find(_item => _item.keyword === theKey)
        if (item) {
          results.push({
            ...item,
            type: restText ? item.type : 'keyword',
            handlerText: restText
          })
          return results
        }
        for (let item of plugins) {
          if (item.keyword && item.keyword.includes(value)) {
            results.push(item)
          }
        }

        item = searchs.find(_item => _item.keyword === theKey)
        if (item && restText) {
          results.push({
            type: 'url',
            title: item.title.replace('{keyword}', restText || '...'),
            url: item.url.replace('{keyword}', encodeURIComponent(restText)),
            // icon: 'https://record.yunser.com/static/img/sign.svg',
            icon: 'https://app.yunser.com/static/img/extension.svg',
            // icon: 'https://app.yunser.com/static/img2/search.svg',
            description: '',
          })
          return results
        }
        for (let item of searchs) {
          if (item.keyword.includes(value)) {
            results.push({
              type: 'keyword',
              keyword: item.keyword,
              title: item.title.replace('{keyword}', '...'),
              // icon: 'https://life.yunser.com/static/img/baidu.svg',
              icon: 'https://app.yunser.com/static/img/build.svg',
              description: '',
            })
          }
        }
        
        let filterSearchs = searchs.slice(0, 3)
        for (let item of filterSearchs) {
          results.push({
            type: 'url',
            title: item.title.replace('{keyword}', value),
            // icon: 'https://life.yunser.com/static/img/baidu.svg',
            icon: 'https://app.yunser.com/static/img2/search.svg',
            url: item.url.replace('{keyword}', encodeURIComponent(value)),
            // url: `https://www.baidu.com/s?wd=${encodeURIComponent(value)}`,
            description: '',
          })
        }

        for (let item of plugins) {
          if (item.match && item.match === 'TEXT') {
            results.push(item)
          }
          if (item.match && typeof item.match === 'function' && item.match(value) > 0) {
            results.push(item)
          }
        }
      }

      return results
    }

    let newSuggestions = getSuggestion(this.state.keyword)
    console.log('suggestions', newSuggestions)
    this.setState({
      suggestions: newSuggestions,
      activeIndex: 0,
      // keyword: e.target.value
    })
  }

  componentDidMount() {
    const setState = value => this.setState(value)

    ipc.on('news2', function() {
      console.log('get news2')
    })
    ipcRenderer.on('focus', (event, message) => {
      console.log('on focus', message)
      let ok = () => {
        document.querySelector('input').focus()
        document.querySelector('input').select()
        this.showSuggestion()
      }
      // if (message.match(/^http(s)?:\/\//)) {
      //   console.log('匹配')
        
      // } else {
      //   ok()
      // }
      setState({
        keyword: message
      }, ok)
    })
    ipcRenderer.on('debug', function(event, message) {
      console.error('debug', message)
    })

    

    sendMessage('getApps', null, message => {
      console.log('getAppsSuccess', message)
      setState({
        apps: message,
        // apps: [
        //   ...message.map(item => {
        //     return {
        //       ...item,
        //       type
        //     }
        //   })
        // ]
      })
    })

    

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
    const { number, suggestions, activeIndex, activeTabIndex, apps, keyword, inputFileName, inputFilePath } = this.state
    const setState = value => this.setState(value)
    let _this = this
    // return <div>123</div>

    let onClick = () => {
      console.log('sended')
      ipcRenderer.send('news', 'hellow')
      // ipcRenderer.send('MainMsgFromRender','hellow')
    }

    let clickItem = item => {
      if (item.type === 'url') {
        console.log('open', item.url)
        ipcRenderer.send('openUrl', item.url)
        console.log('qingkong')
        setState({
          suggestions: [],
          keyword: ''
        })
        return
      }
      if (item.type === 'keyword') {
        setState({
          keyword: item.keyword + ' '
        })
        return
      }
      if (item.handler) {
        item.handler(item.handlerText || keyword)
        setState({
          suggestions: [],
          keyword: ''
        })
        return
      }
    }

    function getClipboard() {
      // sendMessage()
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
          <div className={styles.key}>{index === 0 ? '↵' : ('⌘' + (index + 1))}</div>
        </div>
      )
    }

    let isCommandOrCtrlDown = false

    function onKeyUp(e) {
      console.log(e.keyCode)
      if (e.keyCode === 91) {
        isCommandOrCtrlDown = false
      }
    }

    function onKeyDown(e) {
      console.log(e.keyCode)

      if (e.keyCode === 91) {
        isCommandOrCtrlDown = true
      }

      if (e.keyCode === 8) {
        if (!keyword.length && inputFileName) {
          setState({
            inputFileName: ''
          })
        }
      }

      if (e.keyCode === 13) {
        clickItem(suggestions[activeIndex])
        // alert(e.target.value)
      }

      if (isCommandOrCtrlDown && e.keyCode === 86) {
        sendMessage('getClipboard', null, message => {
          console.log('剪切板会掉', message)
          if (message.type === 'file') {
            _this.startTime = new Date().getTime()
            // setState()
            // alert('文件')
            console.log('设置文件')
            let arr = message.data.split('/')
            setState({
              keyword: '',
              inputFilePath: message.data,
              inputFileName: arr[arr.length - 1]
            })
          }
        })
        // e.preventDefault()
        // return false
      }

      if (isCommandOrCtrlDown && e.keyCode >= 49 && e.keyCode <= 57) {
        let idx = e.keyCode - 49
        console.log('idx', idx)
        if (idx < suggestions.length) {
          clickItem(suggestions[idx])
        }
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
        e.preventDefault()
        return false
//         let ele = document.querySelector('input')
//         ele.focus()
//         var len = ele.value.length
//         if (document.selection){
//             var sel = ele.createTextRange();
//             sel.moveStart('character', len);
//             sel.collapse();
//             sel.select();
//         }else {
//             ele.selectionStart = ele.selectionEnd = len;
//         }
 
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
        e.preventDefault()
        return false
      }
    }


    let onInput = (e) => {
      if (_this.startTime) {
        if (new Date().getTime() - _this.startTime < 20) {
          this.setState({
            keyword: ''
          }, () => {
          })
          _this.showSuggestion()
          return
        }
        console.log('间隔事件', new Date().getTime() - _this.startTime)
        _this.startTime = null
      }
      console.log(e.target.value)
      this.setState({
        keyword: e.target.value
      }, () => {
        this.showSuggestion()
      })
    }

    let clear = (e) => {
      this.setState({
        keyword: '',
        suggestions: []
      })
    }

    let onTabChange = (index) => {
      if (index === 5) {
        // console.error('block')
        document.querySelector('#webview-box2').style.display = 'block'
      } else {
        // console.error('none')
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
      sendMessage('openApp', item.path, () => {

      })
      return
      setState({
        activeTabIndex: 5
      })

          // https://www.baidu.com/
          document.querySelector('#webview-box2').style.display = 'block'
      document.querySelector('#webview-box2').innerHTML = `
      <div class="webviewBox" id="webview-box">
        <webview class="webview" disablewebsecurity isUnsafeEvalEnabled webPreferences="" src="${item.path}"></webview>
        <div class="webviewClose" id="webviewClose">关闭</div>
      </div>
      `
      const webview = document.querySelector('webview')
      webview.getWebContents()
      webview.addEventListener('dom-ready', () => {
        webview.openDevTools()
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
    function getAppFolder() {
      ipcRenderer.send('getAppFolder')
    }
    function openDevTools() {
      ipcRenderer.send('openDevTools')
    }

    return (
      <div className={styles.page} data-tid="container">
        <div className={styles.searchBox}>
          <div className={styles.content}>
            {/* <img className={styles.icon} src="https://app.yunser.com/static/img/build.svg" /> */}
            {inputFileName &&
              <div className={styles.fileNameBox}>
                <div className={styles.fileName}>{inputFileName}</div>
              </div>
            } 
            <input id="input" value={keyword} className={styles.input} placeholder="搜索" 
              onInput={onInput} onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
            {keyword.length > 0 &&
              <div className={styles.close} onClick={clear}>×</div>
            }
            {/* <div className={styles.icon}>U</div> */}
          </div>
          {suggestions.length > 0 &&
            <div className={styles.suggestList}>
              {suggestions.map(SuggestItem)}
            </div>
          }
        </div>
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
              <button className="ui-btn" onClick={getAppFolder}>获取插件目录</button>
              <button className="ui-btn" onClick={openDevTools}>打开控制台</button>
              {/* <h2 className={styles.all}>所有插件</h2> */}
              {AppList}
              {/* <div className={styles.appEmpty}>没有应用，去应用市场瞧一瞧~</div> */}
            </div>
          }
          {activeTabIndex === 2 &&
            <div className={styles.tabContent}>
              {/* <button className="ui-btn" onClick={openAppFolder}>打开插件目录</button> */}
              {/* <button className="ui-btn" onClick={refresh}>刷新</button> */}
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
          <button onClick={getClipboard}>获取剪切板内容</button>
          {/* <h2>这是首页，啦啦啦</h2> */}
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

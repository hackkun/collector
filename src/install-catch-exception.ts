import { eventEmitter, EventNames } from './event-emitter'
import { CatchExceptionConfig } from '../typings'

export class InstallCatchException {
  constructor() {
    this.enhanceOtherJsResource()

    this.resourceExceptionn()
    this.installJsException()
    this.installPromiseExecption()
    this.installAjaxException()
  }

  /**
   * 资源加载异常 img、script
   */
  private resourceExceptionn() {
    window.addEventListener &&
      window.addEventListener(
        'error',
        (ev: any) => {
          //  避免和js异常产生重复上报
          if (ev.target !== window) {
            const catchData: Partial<CatchExceptionConfig> = {
              type: 'resource',
              msg: `${ev.target.localName} load error`,
              file: ev.target.src || ev.target.href
            }
            eventEmitter.emit(EventNames.Exception, catchData)
          }
        },
        true
      )
  }

  /**
   * 监听 javaSript脚本运行异常
   */
  private installJsException() {
    window.onerror = (msg, url, line, col, error) => {
      let catchData: Partial<CatchExceptionConfig> = null

      if (typeof error === 'object') {
        catchData = {
          type: error.name,
          col,
          line,
          msg: error.message,
          file: url
        }
      } else {
        catchData = { type: msg as string }
      }

      eventEmitter.emit(EventNames.Exception, catchData)
    }
  }

  /**
   * 监听 promise 异常
   */
  private installPromiseExecption() {
    window.onunhandledrejection = (ev) => {
      const catchData: Partial<CatchExceptionConfig> = {
        type: 'unhandledrejection'
      }

      if (typeof ev.reason === 'object') {
        catchData.msg = ev.reason.message
        const matches = (ev.reason.stack || '').match(/(http.*\.js)/)
        catchData.file = matches ? matches[1] : null
      }

      if (typeof ev.reason === 'string') {
        catchData.msg = ev.reason
      }

      eventEmitter.emit(EventNames.Exception, catchData)
    }
  }

  /**
   * 监听 ajax 异常
   */
  private installAjaxException() {
    // XMLHttpRequest
    if (window.XMLHttpRequest) {
      const xmlhttp = window.XMLHttpRequest
      const _oldSend = xmlhttp.prototype.send
      const _handleEvent = function (event) {
        if (event && event.currentTarget && event.currentTarget.status !== 200) {
          // 错误上报
        }
      }
      xmlhttp.prototype.send = (...args: any[]) => {
        if (this['addEventListener']) {
          _handleEvent
          this['addEventListener']('error')
          this['addEventListener']('load', _handleEvent)
          this['addEventListener']('abort', _handleEvent)
        } else {
          var _oldStateChange = this['onreadystatechange']
          this['onreadystatechange'] = function (event) {
            if (this.readyState === 4) {
              _handleEvent(event)
            }
            _oldStateChange && _oldStateChange.apply(this, arguments)
          }
        }
        return _oldSend.apply(this, args)
      }
    }
  }

  /**
   * 劫持第三方脚本 和 直接引入脚本添加，添加crossorigin
   */
  private enhanceOtherJsResource() {
    const __oldFn = document.createElement
    document.createElement = (tagName: string, options?: ElementCreationOptions) => {
      const element = __oldFn.call(document, tagName, options)
      if (tagName === 'script') {
        element.crossOrigin = 'anonymous'
      }
      return element
    }
  }
}

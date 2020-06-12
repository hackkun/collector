import { Base64 } from 'js-base64'
import browserInfo from 'browser-info'
import {
  CollectorConstructorOption,
  CatchExceptionConfig,
  DeviceDetailOption
} from '../typings'
import { dateFormat } from './date.format'
import { eventEmitter, EventNames } from './event-emitter'
import { CatchMode } from './constant'

/**
 * 上报数据
 */
export class ReportData {
  private options: CollectorConstructorOption
  // 基本数据配置
  private deviceDetail: DeviceDetailOption
  // 上报数据队列
  private reportStacks = []

  constructor(options: CollectorConstructorOption) {
    this.options = options

    const { os, name, fullVersion } = browserInfo()
    this.deviceDetail = { os: os, bsName: name, bsVer: fullVersion }

    this.initEventEmitter()
  }

  /**
   * 初始化数据收集
   */
  private initEventEmitter() {
    /**
     * 异常捕获事件接收
     */
    eventEmitter.on(EventNames.Exception, (data: CatchExceptionConfig) => {
      const catchData: CatchExceptionConfig = {
        mode: CatchMode.Exception,
        url: window.location.href.split('?')[0],
        appid: this.options.appid,
        time: dateFormat(new Date()),
        ...data,
        ...this.deviceDetail
      }
      this.add(catchData)
    })

    /**
     * 自定义事件接收
     */
    eventEmitter.on(EventNames.Customm, (data: CatchExceptionConfig) => {
      const catchData: CatchExceptionConfig = {
        ...data,
        mode: CatchMode.Custom,
        appid: this.options.appid,
        time: dateFormat(new Date())
      }
      this.add(catchData)
    })
  }

  /**
   * 添加数据
   */
  private add(errMsg: Partial<CatchExceptionConfig>) {
    errMsg.time = dateFormat(new Date())
    const base64 = Base64.encode(JSON.stringify(errMsg))
    console.log('stack', errMsg)
    this.reportStacks.push(base64)
    // new Image().src = this.reportUrl + errMsg
  }
}

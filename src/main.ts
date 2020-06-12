import { ReportData } from './report-data'
import { eventEmitter, EventNames } from './event-emitter'
import { InstallCatchException } from './install-catch-exception'
import { CollectorConstructorOption } from '../typings'

class Collector {
  private options: CollectorConstructorOption

  constructor(opts: CollectorConstructorOption) {
    this.options = opts
    new ReportData(this.options)
    new InstallCatchException()
  }

  /**
   * 用户自定义扩展配置
   */
  setConfig(config: object) {
    Object.assign(this.options, config)
  }

  /**
   * 自定义上报数据
   */
  reportCustom(evtid: string, extra: string) {
    eventEmitter.emit(EventNames.Customm, { evtid, extra })
  }
}

export default Collector

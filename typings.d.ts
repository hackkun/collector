import { CatchMode } from './src/constant'

export interface CollectorConstructorOption {
  appid: string
  reportUrl: string
}

export interface DeviceDetailOption {
  os: string
  bsName: string
  bsVer: string
}

export type BaseConfigOption = {
  appid: string
  [key: string]: any
} & DeviceDetailOption

export interface CatchExceptionConfig extends BaseConfigOption {
  mode: CatchMode
  type: string
  msg: string
  url: string
  file?: string
  line?: number
  col?: number
  time?: string
}

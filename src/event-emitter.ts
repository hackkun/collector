interface Events {
  [key: string]: Function[]
}

export enum EventNames {
  Exception = 'Exception',
  Customm = 'Customm',
  Data = 'Data',
  Performance = 'Performance'
}

class EventEmitter {
  private static instance: EventEmitter
  private events: Events = {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new EventEmitter()
    }
    return this.instance
  }

  on(type: EventNames, cb: Function) {
    if (!this.events[type]) {
      this.events[type] = []
    }
    this.events[type].push(cb)
  }

  emit(type: EventNames, ...args: any[]) {
    if (this.events[type]) {
      this.events[type].forEach((cb) => cb.apply(this, args))
    }
  }

  remove(type: EventNames) {
    delete this.events[type]
  }
}

export const eventEmitter = EventEmitter.getInstance()

/**
 * Author: Meng
 * Date: 2022-03-09
 * Desc: 事件订阅分发
 */

export class EventBus {
  static _event_list = [];
  static _msg_list = [];

  // 事件注册
  static add({ key = '', callback = null, tag = '', type = 2 } = {}) {
    this._event_list = this._event_list.filter(e => e.key != key || e.tag != tag)
    this._event_list.push({ key, callback, tag, type })

    let remove = false
    this._msg_list.forEach(e => {
      if (e.key == key) {
        remove = callback && callback(e.data)
      }
    })
    this._msg_list = this._msg_list.filter(e => e.key != key || !remove)
  }

  // 订阅单次事件
  static once({ key = '', callback = null, tag = '' } = {}) {
    this.add(key, callback, tag, 1)
  }

  // 发送粘性消息
  static stick(key, data) {
    this.send(key, data);

    this._msg_list = this._msg_list.filter(e => e.key != key)
    this._msg_list.push({ key, data })
  }

  // 发送消息
  static send(key, data, delay = 0) {
    if (delay > 0) {
      const timer = setTimeout(() => {
        clearTimeout(timer)
        this._sendMsg(key, data)
      }, delay)
    } else {
      this._sendMsg(key, data)
    }
  }
  // 具体发送
  static _sendMsg(key, data) {
    this._event_list.forEach(e => {
      if (e.key == key) {
        e.callback && e.callback(data)
      }
    })
    this._event_list = this._event_list.filter(e => e.key != key || e.type != 1)
  }

  // 移除消息
  static remove({ key, tag, callback } = {}) {
    if (key) {
      this._event_list = this._event_list.filter(e => e.key != key || e.tag != tag)
    } else {
      this._event_list = this._event_list.filter(e => e.callback != callback)
    }
  }

  static clear() {
    EventBus._event_list = [];
    EventBus._msg_list = [];
  }
}

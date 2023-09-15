# 事件订阅分发

### 使用文档

> 使用前建议先维护一个事件 Key 管理的对象。如:

```js
const BusKey = {
  login: 'login_key',
  order: 'order_key',
  address: 'address_key',
}

// 事件订阅
  EventBus.add({key: string, callback: (data: Any) => boolean|null, tag?:string, type?: number}={}): void;

  // 订阅单次事件
  EventBus.once({key: string, callback: (data: Any) => boolean|null, tag?:string}={}): void;

  // 发送粘性消息
  EventBus.stick(key: string, data: any): void;

  // 发送消息 delay: 延时多少秒发送
  EventBus.send(key: string, data: any, delay = 0): void;

  // 移除消息
  EventBus.remove({key: string, tag: string, callback} = {}): void;

  // 清除全部消息
  EventBus.clear(): void;

```

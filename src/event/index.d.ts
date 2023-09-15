/**
 * Author: Meng
 * Date: 2022-03-09
 * Desc: 事件订阅分发
 */

interface Event {
  key: string; // 事件名
  callback: (data: any) => boolean | null; // 事件回调函数
  tag: string; // 事件标识
  type?: number; // 事件类型-1单次2普通
}
interface EventDao {
  key: string; // 事件名
  callback: (data: any) => boolean | null; // 事件回调函数
  tag: string; // 事件标识
  type: number; // 事件类型-1单次2普通
}
interface MsgDao {
  key: string; // 事件名
  data: any; // 数据
}

declare class EventBus {
  private static _event_list: Array<EventDao>;
  private static _msg_list: Array<MsgDao>;

  /**
   * 事件注册
   * @param options {key: string, tag: string, type: number, callback}
   */
  public static add(options: Event): void;

  /**
   * 订阅单次事件
   * @param options {key: string, tag: string, callback}
   */
  public static once(options: Event): void;

  // 发送粘性消息
  public static stick(key: string, data: any): void;

  // 发送消息
  public static send(key: string, data: any, delay: number): void;
  /**
   * 移除消息
   * @param options {key: string, tag: string, callback}
   */
  public static remove(options: Event): void;

  // 清除全部消息
  public static clear(): void;
}

export { EventBus };

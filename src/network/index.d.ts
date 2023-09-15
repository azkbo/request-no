/**
 * Author: Meng
 * Date: 2022-03-09
 * Desc:
 */

declare enum HostEnv {
  prod = "prod",
  test = "test",
  uat = "uat",
  dev = "dev",
}

type RequestOption = {
  url: string;
  method?: string;
  params?: object | string | undefined;
  headers?: object;
  /** 请求类型 分为：text/blob/form-data */
  responseType?: string;
};

type RequestParams = {
  /** 请求地址 */
  url: string;
  /** 请求方法 */
  method?: "POST" | "GET";
  /** 请求参数 */
  params?: object | string | undefined;
  /** 请求头 */
  headers?: {[key:string]: string};
  /** 域名(服务) */
  // host?: string;
  /** 请求环境 */
  // env?: HostEnv;
  /** 是分显示加载框 */
  loading?: boolean;
  /** 加载框文案 */
  loadingText?: string;
  /** 请求错误 是否Toast提示 */
  toast?: boolean;
  /** 是否请求重连 */
  reload?: boolean;
  /** 当前请求重连次数 */
  count?: number;
  /** 最大重连次数 */
  maxCount?: number;
  /** 请求类型 分为：text/blob/stream  browser only: 'blob' */
  responseType?: string;
};

/**
 * 环境配置
 * @deprecated
 */
type HostConfig = {
  /** 线上环境 */
  prod: object;
  /** 测试环境 */
  test?: object;
  /** dev环境 */
  dev?: object;
  /** Uat环境 */
  uat?: object;
};

type ResultData<T> = {
  data?: T;
  code: number;
  message: string;
  headers?: object;
};

type ParamsData = {
  headers?: object | undefined;
  params?: object;
};

/**
 * 网络请求配置
 */
type NetConfig = {
  /** 默认请求环境 */
  // def_env?: string;
  /** 默认请求域名(服务) */
  // def_host?: string;
  /**
   * 项目请求域名配置，分环境
   */
  // env_hosts: HostConfig;

  /** 网络请求实体 */
  network: (options: RequestOption) => Promise<any>;
  /** 解析请求返回数据 */
  parseData: <T>(res: any, url?: string) => ResultData<T>;

  /** 加载框关闭间隔-防抖 */
  min_interval?: number;
  /** 请求超时时间 */
  // timeout?: number;

  /** 解析请求报错 */
  parseError?: (err: any, url?: string) => ResultData<null>;
  /** 请求错误提示 */
  showToast?: (msg: string) => void;
  /** 显示及关闭加载框 */
  showLoading?: (show: boolean, msg: string) => void;
  /** 自定义加载框逻辑 */
  showCustomLoading?: (show: boolean, msg: string) => void;
  /** 请求前，参数及请求头配置 */
  interceptor?: (params: object, headers: object) => ParamsData;
  /** 根据获取当前环境host */
  getRequestHost: (host: string, env?: string) => string;
};

/**
 * 网络请求
 */
declare class RequestNo {
  // private def_env?: string;
  // private def_host?: string;
  // private env_hosts?: HostConfig;
  private network: (options: RequestOption) => Promise<any>;
  private parseData: <T>(res: any, url?: string) => ResultData<T>;

  private min_interval?: number;
  private timer_id?: number; // 定时器

  private parseError?: (err: any, url?: string) => ResultData<null>;
  private showToast?: (msg: string) => void;
  private showLoading?: (show: boolean, msg: string) => void;
  private showCustomLoading?: (show: boolean, msg: string) => void;
  private interceptor?: (
    params: object,
    headers: object
  ) => Promise<ParamsData>;
  private getRequestHost: (host: string, env?: string) => string;

  /**
   * 构造函数
   * @param config -{}
   */
  constructor(config?: NetConfig);

  /**
   * 设置请求环境
   * @param env -环境
   */
  // setEnv(env: HostEnv): void;

  /**
   * 发起网络请求
   * @param options -{}
   */
  request<T>(options: RequestParams): Promise<ResultData<T>>;
}

export { RequestNo, RequestOption, RequestParams, ResultData };

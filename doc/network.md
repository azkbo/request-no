# 网络请求封装

### 使用

```js
// 环境及服务器设置
const env_hosts = {
  prod: {
    def: "http://def.demo.com",
    order: "http://order.demo.com",
  },
  test: {
    def: "http://def-test.demo.com",
    order: "http://order-test.demo.com",
  },
  dev: {
    def: "http://def-dev.demo.com",
    order: "http://order-dev.demo.com",
  },
};
// 获取网络host
export function getRequestHost(host, env): string {
  console.log(host, env)
  return getHostFromTag(host || 'def', env || 'prod');
}

// 获取指定标签环境域名
export function getHostFromTag(tag, env): string {
  const envTag = env || "prod";
  const domain = tag || "def";
  return env_hosts[envTag][domain];
}

// 请求头及参数处理
export function interceptor(params: any, headers: any) {
  let token = "1234567890";
  let agent = "123agent45678";
  headers.appAgent = agent;
  headers.token = token;
  return { params, headers };
}

// -------------------------- fetch请求 -------------------------

// 配置
export function network({ url, data, headers, method }) {
  let body = null;
  if (method == 'GET') {
    url = _parseBody(url, data)
  } else {
    body = JSON.stringify(data);
  }
  return fetch(url, { method, headers, body }).then(res => res.json());
}
// 处理 fetch get请求参数
function _parseBody(url, params = {}) {
  let list = []
  for (const key in params) {
    list.push(`${key}=${params[key]}`)
  }
  const unit = url.includes('?') ? '&' : (list.length > 0 ? '?' : '');
  return `${url}${unit}${list.join('&')}`
}

// ----------------- axios请求 -----------------

const axiosIns = axios.create({ timeout: 20000 });
// 配置 axios请求
export function network(options) {
  return new Promise((resolve, reject) => {
    axiosIns.request(options)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

// 解析response数据 -
function parseData<T>(res: any, url?: string): ResultData<T> {
  let code = res.status, message = res.statusText, headers = {}, data = res.data;
  return { code, data, message: "", headers };
}

// 解析错误信息 -
function parseError(res: any, url?: string): ResultData<null> {
  let code = res.code, message = 'error', status = -1;
  return { code, message, data: url };
}

// 显示toast
function showToast(msg: string) {}

// 显示加载中
function showCustomLoading(loading: boolean, msg: string) {}

// network：可配置 fetch或axios
const instance = new RequestNo({
  network,
  parseData,
  parseError,
  interceptor,
  getRequestHost,
  showCustomLoading,
  showToast,
});

// 请求入口
export function request<T>(options: RequestParams) {
  return instance.request<T>(options);
}

// 实例化 全部配置参数 -下面是伪代码
new RequestNo({
  /** 网络请求实体 */
  network: Promise<any>;
  /** 解析请求返回数据 */
  parseData: (res: any) => ResultData;

  /** 加载框关闭间隔-防抖 */
  min_interval?: number;

  /** 解析请求报错 */
  parseError?: (err: any) => ResultData;
  /** 请求错误提示 */
  showToast?: (msg: string) => void;
  /** 显示及关闭加载框 */
  showLoading?: (show: boolean, msg: string) => void;
  /** 请求前，参数及请求头配置 */
  interceptor?: (data: object, headers: object) => ParamsData;
  /** 根据获取当前环境host */
  getRequestHost: (host: string, env?: string) => string;
});

// 发起请求全部参数 -下面是伪代码
RequestNo.request({
  /** 请求地址 */
  url: string;
  /** 请求方法 */
  method?: string;
  /** 请求参数 */
  data?: object | string | undefined;
  /** 请求头 */
  headers?: Headers;
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
})
```

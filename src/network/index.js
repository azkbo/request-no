/**
 * Author: Meng
 * Date: 2022-03-09
 * Desc: 
 */

export class RequestNo {

  min_interval = 800; // 最小间隔
  timer_id = 0; // 定时器

  // def_env = null;
  // def_host = null;
  // env_hosts = { prod: {}, test: {}, uat: {}, dev: {} };

  network = null;
  interceptor = null;
  parseData = null;
  parseError = null;
  showLoading = null;
  showCustomLoading = null;
  showToast = null;
  getRequestHost = null;

  constructor(config = {}) {
    for (const key in config) {
      const value = config[key];
      this[key] = value;
    }
  }

  request = async ({ url = '', method = 'GET', params = {}, headers = {}, host = null, env = null, responseType = 'json', loading = true, loadingText = '加载中...', toast = true, reload = false, count = 1, maxCount = 3 } = {}) => {

    if (loading) {
      this._showLoading(true, loadingText); // 加载框
    }

    let rhost = null;
    if (this.getRequestHost != null) {
      rhost = this.getRequestHost(host, env);
    } else {
      console.error('请配置域名！new RequestNo({getRequestHost: (host, env) => "项目请求的域名"})');
      // rhost = this._getRequestHost(host || this.def_host, env || this.def_env);
    }

    const url2 = `${rhost}${url}`;
    let params2 = null;
    let headers2 = null;

    if (this.interceptor != null) {
      const interce = await this.interceptor(params, headers);
      params2 = interce.params || {};
      headers2 = interce.headers || {};
    } else {
      params2 = this._mergeParams(params);
      headers2 = this._mergeHeaders(headers);
    }

    const options = { url: url2, params: params2, headers: headers2, method, responseType };

    return await new Promise((resolve) => {
      // 请求结构封装
      const result = { code: -1, data: '', message: '' };
      if (!rhost) {
        console.error('请配置请求域名！new RequestNo({env_hosts: "项目请求的域名"})');
        resolve(result);
        return;
      }
      if (this.network == null) {
        console.error('请配置请求实体！new RequestNo({network: "fetch或者axios实例"})');
        resolve(result);
      } else {
        this.network(options).then(res => {
          this._parseData(res, result, url2);
        }).catch(err => {
          this._parseErr(err, result, url2);
        }).finally(() => {
          const succeed = (result.code == 0 || result.code == 200);
          // 请求重连
          if (!succeed && reload && count < maxCount) {
            const curCount = count + 1;
            const timer = setTimeout(() => {
              clearTimeout(timer);
              this.request({ url, params, method, headers, host, env, responseType, loading, toast, reload, maxCount, count: curCount });
            }, 1500);
          } else {
            // 加载框
            if (loading) {
              this._showLoading(false, ''); // 显示加载框
            }
            resolve(result);
            // 显示 toast
            if (!succeed && toast) {
              this._showToast(result.message);
            }
          }
        });
      }
    })
  }

  // 弃用
  // _getRequestHost(host = 'def', env = 'prod') {
  //   const envObj = this.env_hosts[env];
  //   const hasHost = Object.hasOwnProperty.call(envObj, host);
  //   return hasHost ? envObj[host] : '';
  // }

  _mergeParams(params = {}) {
    return params;
  }

  _mergeHeaders(headers = {}) {
    // headers['Content-Type'] = 'application/json;charset=utf-8';
    return headers;
  }

  _parseData(res, result, url) {
    // console.log('RequestNo parseDate', res);
    if (this.parseData != null) {
      const data = this.parseData(res, url);
      Object.assign(result, data);
    } else {
      console.log('Not Configured parseData function！');
      result.data = res;
    }
  }

  _parseErr(err, result, url) {
    // console.log('RequestNo parseErr', err);
    if (this.parseError != null) {
      const data = this.parseError(err, url);
      Object.assign(result, data);
    } else {
      result.message = err.message || err;
      console.log('Not Configured parseError function！');
      console.log('RequestNo error:', err);
    }
  }

  _showLoading(show, text) {
    if (this.showCustomLoading != null) {
      this.showCustomLoading(show, text);
    } else if (this.showLoading != null) {
      if (this.timer_id) {
        clearTimeout(this.timer_id);
      }
      if (show) {
        this.showLoading(true, text); // 显示
      } else {
        this.timer_id = setTimeout(() => {
          clearTimeout(this.timer_id);
          this.showLoading(false, ''); // 关闭
        }, this.min_interval);
      }
    } else {
      console.log('Not Configured showLoading function！');
    }
  }

  _showToast(text) {
    if (this.showToast != null) {
      this.showToast(text);
    } else {
      console.log('Not Configured showToast function！');
    }
  }
}

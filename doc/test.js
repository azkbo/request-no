/**
 * Author: Meng
 * Date: 2022-09-27
 * Desc:
 */

import { RequestNo } from "../index";

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


// 配置 axios请求
function network(options) {
  return new Promise((resolve) => {
    resolve(options);
  });
}

// 解析response数据 -
function parseData(res) {
  return { code: 0, data: {}, message: "", header: {} };
}

// network：可配置 fetch或axios
const instance = new RequestNo({
  network,
  parseData,
  env_hosts,
  def_host: "def",
  def_env: "prod",
});

export function request(options) {
  return instance.request(options);
}

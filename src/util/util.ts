import qs from "qs";

export default class Utils {
  static isUndefined(value: any) {
    return typeof value === "undefined";
  }

  static isDefined(value: any) {
    return typeof value !== "undefined";
  }

  static isObject(value: any) {
    // http://jsperf.com/isobject4
    return value !== null && typeof value === "object";
  }

  static isString(value: any) {
    return typeof value === "string";
  }

  static isNumber(value: any) {
    return typeof value === "number";
  }

  static isDate(value: any) {
    return toString.call(value) === "[object Date]";
  }

  static isFunction(value: any) {
    return typeof value === "function";
  }

  static isRegExp(value: any) {
    return toString.call(value) === "[object RegExp]";
  }

  static isBoolean(value: any) {
    return typeof value === "boolean";
  }

  static isElement(node: any) {
    return !!(
      node &&
      (node.nodeName || // we are a direct element
        (node.prop && node.attr && node.find))
    ); // we have an on and find method part of jQuery API
  }

  static isArray = Array.isArray;

  /**
   * 数字转字符串
   */
  static numToString(num: any) {
    if (this.isNumber(num)) {
      return num + "";
    } else {
      return num;
    }
  }

  /**
   * 使用userAgent判断当前页面是否在webView里打开
   */
  static openInWebview() {
    const ua: any = navigator.userAgent.toLowerCase();
    let result: boolean;
    if (ua.match(/MicroMessenger/i) === "micromessenger") {
      // 微信浏览器判断
      result = false;
    } else if (ua.match(/QQ/i) === "qq") {
      // QQ浏览器判断
      result = false;
    } else if (ua.match(/WeiBo/i) === "weibo") {
      result = false;
    } else {
      if (ua.match(/Android/i) !== null) {
        result = ua.match(/browser/i) === null;
      } else if (ua.match(/iPhone/i) !== null) {
        result = ua.match(/safari/i) === null;
      } else {
        result =
          ua.match(/macintosh/i) === null && ua.match(/windows/i) === null;
      }
    }
    return result;
  }

  /**
   * @param params 导出文件所需参数
   * @returns {*}   返回导出拼接字符串
   */
  static paramSerializer(params: any) {
    if (!params) return "";
    const urlPart = [];
    for (const k in params) {
      const value = params[k];
      if (value === null || this.isUndefined(value)) continue;
      if (this.isArray(value)) {
        for (let i = 0, l = value.length; i < l; i++) {
          urlPart.push(k + "=" + value[i]);
        }
      } else {
        urlPart.push(k + "=" + value);
      }
    }
    return urlPart.join("&");
  }

  /**
   * 提取字符串中的数字
   * @param params 传入字符串
   */
  static getNumFromString(params: string) {
    const num = params.replace(/[^0-9]/gi, "");
    return Number(num);
  }

  /**
   *
   * @param params 获取路由中参数
   * @param pageRoute 路由
   * @param name 查询参数名
   */
  static dealRouter(ohter: any, name: string) {
    const local = ohter || window.location;
    const params: string = /#/.test(local.hash) ? local.hash : local.search;
    const res = qs.parse(params.split("?")[1]);
    return (name ? (res[name] ? res[name] : null) : res) as any;
  }

  /**
   * 搜索字段高亮显示
   * @param name 显示字段
   * @param searchKey 搜索字段
   * @param fColor 高亮颜色
   */
  static searchHight(name: string, searchKey: string, fColor?: string): string {
    // const searchReg = new RegExp(searchKey, "ig");
    const searchReg = new RegExp(
      searchKey.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"),
      "ig"
    );
    let result: string = name;
    if (name && searchKey) {
      const index = name.search(searchReg);
      if (index > -1) {
        result = name.replace(
          searchReg,
          `<span style="color:${fColor || "#648FFC"}">${decodeURIComponent(
            searchKey
          )}</span>`
        );
      }
    }
    return result;
  }

  /**
   * 判断是否显示添加按钮
   * 萤小微端不显示，萤石商业智居内显示
   */
  static isAdd(): boolean {
    const ua = navigator.userAgent.toLowerCase();
    const isApp = !!ua.match(/ezvizsaas/i); // 判断是否是在萤石商业智居
    const isDev = !!this.dealRouter(window.location, "dev"); // 判断是否是开发环境（true-开发，false-非开发）
    return isDev ? true : isApp;
  }

  static validatePassword(rule: any, value: any) {
    if (!value) {
      // callback(new Error("请输入密码"));
      return Promise.reject("请输入密码");
    } else if (/\s/.test(value)) {
      // callback(new Error("密码不能包含空格"));
      return Promise.reject("密码不能包含空格");
    } else if (/[\u4e00-\u9fa5]/.test(value)) {
      return Promise.reject("密码不能包含中文");
    } else if (
      !/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,16}$/.test(
        value
      )
    ) {
      return Promise.reject(
        "密码8-16位，需包含大写/小写字母、数字、特殊符号中的三类及以上"
      );
    } else {
      return Promise.resolve();
    }
  }
}

/*
 * @Description:
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-13 10:05:43
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-29 10:55:35
 */
import "isomorphic-fetch";
import Util from "../util/util";
import { errorHandle, setHeader, paramSerializer } from "./util";

class HttpOpts {
  public headers?: Record<string, any>;
  public body?: any;
  public method?: string;
}

class Net {
  public async requst(url: string, opts: HttpOpts) {
    const { isToast = true, returnAll = false } = opts.body;
    delete opts.body.isToast;
    delete opts.body.returnAll;
    const options = await this.handerOpts(opts);
    return fetch(url, options)
      .then(this.checkStatus)
      .then(this.parseJSON)
      .then((data) => {
        debugger;
        if (!returnAll && Number(data.code) !== 200) {
          const error: any = new Error(data.code);
          error.response = {
            status: data.code,
          };
          error.msg = data.msg;
          throw error;
        }
        return data;
      })
      .catch((err) => {
        debugger;
        const newErr = errorHandle(err, isToast);
        throw newErr;
      });
  }

  private checkStatus(response: Response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const error: any = new Error(response.statusText);
    error.response = response;
    throw error;
  }

  private parseJSON(response: Response) {
    return response.json();
  }

  private async handerOpts(opts: HttpOpts) {
    debugger;
    const isForm =
      !!opts.headers &&
      JSON.stringify(opts.headers).indexOf("x-www-form-urlencoded") > -1;
    let headersConfig: any = await setHeader(opts.headers?.contentType);
    if (opts.headers) {
      headersConfig = opts.headers;
    }
    const data: any = {
      method: opts.method || "POST",
      headers: {
        ...headersConfig,
      },
      body: isForm
        ? paramSerializer(opts.body)
        : this.transformRequestData(opts.body),
    };
    return data;
  }

  private transformRequestData(data: any) {
    const obj = this.deleteUndefindeProps(data);
    return Util.isObject(obj) ? JSON.stringify(obj) : obj;
  }

  private deleteUndefindeProps(Obj: any) {
    let newObj: any;
    if (Obj instanceof Array) {
      newObj = []; // 创建一个空的数组
      let i = Obj.length;
      while (i--) {
        newObj[i] = this.deleteUndefindeProps(Obj[i]);
      }
      return newObj;
    } else if (Obj instanceof Object) {
      newObj = {}; // 创建一个空对象
      for (const k in Obj) {
        // 为这个对象添加新的属性
        newObj[k] = this.deleteUndefindeProps(Obj[k]);
      }
      return newObj;
    } else {
      return Util.isUndefined(Obj) ? null : Obj;
    }
  }
}

export default new Net();

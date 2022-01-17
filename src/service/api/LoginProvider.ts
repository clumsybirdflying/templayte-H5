/*
 * @Description: 登录
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-22 16:08:30
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-30 11:42:12
 */

import net from "../net";

// 基础
export interface CommonParams {
  isToast?: boolean; // 是否弹出提示
}

// 登录接口参数
interface LoginParams extends CommonParams {
  ys7_code: string;
  ticket: string;
  yunmouUserId?: string;
}

interface DoLoginParams extends CommonParams {
  account: string;
  password: string;
  captcha?: string;
}

const SAAS_APP_KEY = "33c9dc00b9f34c288ae625778e853704";
const SAAS_APP_FROM = "d1241784819647918671";

const ysclientParams = {
  client_id: SAAS_APP_KEY,
  from: SAAS_APP_FROM,
};

const api = {
  configInfo: "/api/config/ecology/config/customize/get", // 获取配置（协议，隐私政策之类）
  doLogin: "/openauth/doLogin", // 获取开放平台code码（ys7_code）
  login: "/api/user/openauth/yunmou/code/login", // 登录
};

class LoginProvider {
  // 获取配置
  async getConfigInfo(params?: CommonParams) {
    return net.requst(api.configInfo, {
      body: { paramLevel: 1 },
    });
  }

  // 登录
  async login(params: LoginParams) {
    return net.requst(api.login, {
      body: { ...params, clientType: 1, grant_type: 1, isAgree: 1 },
    });
  }

  // 通过开放平台获取登录码
  async doLogin(params: DoLoginParams) {
    return net.requst(api.doLogin, {
      headers: {
        "content-Type": "application/x-www-form-urlencoded",
      },
      body: {
        ...params,
        ...ysclientParams,
        response_type: "code",
        redirect_uri: "default",
        scope: "basic",
        state: "success",
        sign: "0000",
        r: "0000",
        returnUrl: "default",
        returnAll: true,
      },
    });
  }
}

export default new LoginProvider();

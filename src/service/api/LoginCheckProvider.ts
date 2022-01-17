/*
 * @Description: 登录
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-20 10:19:11
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-27 10:06:43
 */

import net from "../net";

// 基础
export interface CommonParams {
  isToast?: boolean; // 是否弹出提示
}

interface TokenCheckParams extends CommonParams {
  ticket: string;
}

const api = {
  loginCheck: "/api/user/third/user/token/check", // 是否登录检查（查询是否存在登录且没过期的token）
};

class LoginProvider {
  // 查询token
  async getToken(params: TokenCheckParams) {
    return net.requst(api.loginCheck, {
      body: { ...params },
    });
  }
}

export default new LoginProvider();

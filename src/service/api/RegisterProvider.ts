/*
 * @Description:注册
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-20 14:17:26
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-28 17:04:51
 */

import net from "../net";
// 基础
export interface CommonParams {
  isToast?: boolean; // 是否弹出提示
}

interface VerifyCodeParams extends CommonParams {
  phone: string;
}

interface CheckVerifyCodeParams extends VerifyCodeParams {
  phone: string;
  smsCode: string;
}

interface RegisterParams extends CommonParams {
  phone: string;
  smsCode: string;
  password: string;
}

const SAAS_APP_KEY = "33c9dc00b9f34c288ae625778e853704";
const SAAS_APP_FROM = "d1241784819647918671";
const CLIENT = "00d317f1511e41f985f2c34b9c057e00";

const api = {
  verifyCode: "/openauth/user/reg/sms", // 获取验证码
  register: "/openauth/user/reg/submit", // 萤石用户注册
  phoneChk: "/openauth/chk", // 查看手机号是否已注册
  checkVerifyCode: "/openauth/user/reg/chk", // 注册 校验手机验证码
};

const ysclientParams = {
  client_id: SAAS_APP_KEY,
  from: SAAS_APP_FROM,
};

class RegisterProvider {
  // 获取验证码
  async getVerifyCode(params: VerifyCodeParams) {
    return net.requst(api.verifyCode, {
      headers: {
        "content-Type": "application/x-www-form-urlencoded",
      },
      body: {
        returnAll: true,
        ...params,
        ...ysclientParams,
      },
    });
  }

  // 验证码校验
  async checkVerifycode(params: CheckVerifyCodeParams) {
    return net.requst(api.checkVerifyCode, {
      headers: {
        "content-Type": "application/x-www-form-urlencoded",
      },
      body: {
        returnAll: true,
        ...params,
        ...ysclientParams,
      },
    });
  }

  async checkYSIsExist(params: VerifyCodeParams) {
    return net.requst(api.phoneChk, {
      headers: {
        "content-Type": "application/x-www-form-urlencoded",
      },
      body: {
        returnAll: true,
        t: 2,
        v: params.phone,
      },
    });
  }

  // 用户注册
  async ysUserRegister(params: RegisterParams) {
    return net.requst(api.register, {
      headers: {
        "content-Type": "application/x-www-form-urlencoded",
      },
      body: {
        returnAll: true,
        ...params,
        client: CLIENT,
        // 此处client_id参数没用
        ...ysclientParams,
      },
    });
  }
}

export default new RegisterProvider();

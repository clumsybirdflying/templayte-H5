/*
 * @Description:
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-21 19:55:39
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-31 11:27:05
 */

/*
 * @Description:注册
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-20 14:17:26
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-21 16:16:33
 */

import net from "../net";
// 基础
export interface CommonParams {
  isToast?: boolean; // 是否弹出提示
}

interface PwdSmsParams extends CommonParams {
  mobile: string;
}

interface MpwSmsChkParams extends CommonParams {
  mobile: string;
  validateCode: string;
}

interface MpwPasswordRestParams extends MpwSmsChkParams {
  password: string;
}

// const SAAS_APP_KEY = "33c9dc00b9f34c288ae625778e853704";
// const SAAS_APP_FROM = "d1241784819647918671";

const api = {
  verifyCode: "/api/user/member/reset/passwd/sms", // 获取验证码
  smsChk: "/api/user/member/reset/passwd/sms/chk", // 忘记密码 校验短信验证码
  passwordReset: "/api/user/member/reset/passwd", // 重置密码
  // register: "/openauth/user/reg/submit", // 萤石用户注册
};

class MpwdProvider {
  // 获取验证码
  async getMpwdCode(params: PwdSmsParams) {
    return net.requst(api.verifyCode, {
      headers: {
        userType: "enterprise",
        "Content-Type": "application/json",
      },
      body: {
        ...params,
      },
    });
  }

  // 校验短信验证码
  async checkSms(params: MpwSmsChkParams) {
    return net.requst(api.smsChk, {
      headers: {
        userType: "enterprise",
        "Content-Type": "application/json",
      },
      body: {
        ...params,
      },
    });
  }

  // 忘记密码 重置密码
  async resetPassword(params: MpwPasswordRestParams) {
    return net.requst(api.passwordReset, {
      headers: {
        userType: "enterprise",
        "Content-Type": "application/json",
      },
      body: {
        ...params,
      },
    });
  }
}

export default new MpwdProvider();

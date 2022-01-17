/*
 * @Description: 修改密码
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-21 19:53:16
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-29 20:15:29
 */

/*
 * @Description:
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-20 14:16:08
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-21 16:08:28
 */

import { createModel } from "@rematch/core";
import {
  dataConfig,
  handleError,
  requestStart,
  successHandle,
} from "../../contents/commonConfig";
import { MpwdProvider } from "../../service/api";

const defaultData = {
  mpwdType: dataConfig,
  page1: {
    phone: "",
  },
  page2: {
    pwd: "",
    pwdC: "",
  },
};

const mpwdState: any = defaultData;

export const Mpwd = createModel({
  namespace: "mpwd",
  state: mpwdState,
  effects: {
    // 忘记密码 发送短信验证码
    async getMpwdCode(payload, state) {
      const target = "mpwdSmsType";
      this.save(requestStart(target));
      const result = await MpwdProvider.getMpwdCode({
        mobile: payload.phone,
      })
        .then((res) => {
          this.save(successHandle({ res, target }));
          return res;
        })
        .catch((err) => {
          this.save(handleError({ error: err, target }));
        });
      return result;
    },

    // 忘记密码 校验短信验证码
    async checkSms(payload, state) {
      const target = "mpwCSmsType";
      this.save(requestStart(target));
      const result = await MpwdProvider.checkSms({
        mobile: payload.phone,
        validateCode: payload.verifyCode,
      })
        .then((res) => {
          this.save(successHandle({ res, target }));
          return res;
        })
        .catch((err) => {
          this.save(handleError({ error: err, target }));
        });
      return result;
    },

    // 忘记密码 校验短信验证码
    async resetPassword(payload, state) {
      const target = "resetPwd";
      this.save(requestStart(target));
      const result = await MpwdProvider.resetPassword({
        mobile: payload.phone,
        validateCode: payload.verifyCode,
        password: payload.pwd,
      })
        .then((res) => {
          this.save(successHandle({ res, target }));
          return res;
        })
        .catch((err) => {
          this.save(handleError({ error: err, target }));
        });
      return result;
    },
  },

  reducers: {
    save(state, payload) {
      return { ...state, ...payload };
    },
  },
});

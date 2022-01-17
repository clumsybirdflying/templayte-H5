/*
 * @Description:
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-20 14:16:08
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-22 21:57:06
 */

import { createModel } from "@rematch/core";
import {
  dataConfig,
  handleError,
  requestStart,
  successHandle,
} from "../../contents/commonConfig";
import { DataConfig } from "../../contents/commonInterface";
import { RegisterProvider } from "../../service/api";

interface IRegister {
  registerSms: DataConfig;
}

const defaultData = {
  registerSms: dataConfig,
};

const registerState: IRegister = defaultData;

export const Register = createModel({
  namespace: "register",
  state: registerState,
  effects: {
    // 获取验证码
    async getVerifyCode(payload, state) {
      const target = "registerSms";
      this.save(requestStart(target));
      const result = await RegisterProvider.getVerifyCode({
        phone: payload.phone,
      })
        .then((res) => {
          this.save(successHandle({ res, target }));
          return res;
        })
        .catch((err) => {
          this.save(handleError({ error: err, target }));
        });
      debugger;
      console.log("获取验证码", result);
      return result;
    },

    // 获取验证码
    async ysUserRegister(payload, state) {
      const target = "registerType";
      this.save(requestStart(target));
      const result = await RegisterProvider.ysUserRegister({
        phone: payload.phone,
        smsCode: payload.verifyCode,
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

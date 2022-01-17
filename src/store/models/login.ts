/*
 * @Description: 登录
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-22 16:07:19
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-30 11:42:30
 */

import { createModel } from "@rematch/core";
import {
  dataConfig,
  handleError,
  requestStart,
  successHandle,
} from "../../contents/commonConfig";
import { DataConfig } from "../../contents/commonInterface";
import { LoginProvider } from "../../service/api";

interface ILogin {
  baseConfig: DataConfig;
  doLoginData: DataConfig;
  pageData: {
    phone: string;
    pwd: string;
  };
}

const defaultData = {
  baseConfig: dataConfig,
  doLoginData: dataConfig,
  pageData: {
    phone: "",
    pwd: "",
  },
};

const loginState: ILogin = defaultData;

export const Login = createModel({
  namespace: "Login",
  state: loginState,
  effects: {
    // 获取配置信息
    async getConfigInfo(payload, state) {
      const target = "baseConfig";
      this.save(requestStart(target));
      const result = await LoginProvider.getConfigInfo({})
        .then((res) => {
          this.save(successHandle({ res, target }));
          return res;
        })
        .catch((err) => {
          this.save(handleError({ error: err, target }));
        });
      return result;
    },
    // 获取code码
    async doLogin(payload, state) {
      const target = "doLoginData";
      this.save(requestStart(target));
      const result = await LoginProvider.doLogin({
        account: payload.phone,
        password: payload.pwd,
        captcha: payload.captcha,
      })
        .then((res) => {
          this.save(successHandle({ res, target }));
          return res;
        })
        .catch((err) => {
          console.log("错误处理", err);
          debugger;
          this.save(handleError({ error: err, target }));
        });
      return result;
    },

    // 登录
    async login(payload, state) {
      const target = "loginData";
      this.save(requestStart(target));
      const result = await LoginProvider.login({
        ys7_code: payload.ys7_code,
        ticket: payload.ticket,
        yunmouUserId: payload.yunmouUserId,
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

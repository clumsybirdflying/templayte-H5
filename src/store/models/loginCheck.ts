/*
 * @Description: 登录以及免登录
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-14 15:19:21
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-22 21:47:52
 */

import { createModel } from "@rematch/core";
import {
  dataConfig,
  handleError,
  requestStart,
  successHandle,
} from "../../contents/commonConfig";
import { DataConfig } from "../../contents/commonInterface";
import { TokenCheckProvider } from "../../service/api";

interface ILoginCheck {
  LoginCheckType: DataConfig;
  tokenData: DataConfig;
}

const defaultData = {
  LoginCheckType: dataConfig,
  tokenData: dataConfig,
};

const LoginCheckState: ILoginCheck = defaultData;

export const LoginCheck = createModel({
  namespace: "loginCheck",
  state: LoginCheckState,
  effects: {
    // 查询是否已登录--查询token
    async getToken(payload, state) {
      const target = "tokenData";
      this.save(requestStart(target));
      const result = await TokenCheckProvider.getToken({
        ticket: payload.ticket,
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

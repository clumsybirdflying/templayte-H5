/* eslint-disable no-undef */

import { Toast } from "antd-mobile";
import Utils from "./util";

const ua = navigator.userAgent.toLowerCase();
const isApp = ua.match(/ezvizsaas/i);

// 获取token
async function JSBgetToken() {
  let token = "";
  if (isApp) {
    try {
      token = await SaaSBridge.getToken();
    } catch (error) {
      Toast.info("token获取失败");
    }
  } else {
    token =
      Utils.dealRouter(window.location, "token") ||
      window.localStorage.getItem("token") ||
      "";
  }
  return token;
}

// 获取accessToken
async function JSBgetAccessToken() {
  let accessToken = "";
  if (isApp) {
    try {
      accessToken = await SaaSBridge.getAccessToken();
    } catch (error) {
      Toast.info("accessToken获取失败");
    }
  } else {
    accessToken = window.localStorage.getItem("accessToken");
  }
  return accessToken;
}

// 刷新token
async function JSBrefreshToken() {
  const clientType = Utils.dealRouter(window.location, "clientType");
  if (isApp) {
    try {
      await SaaSBridge.refreshToken();
    } catch (error) {
      Toast.info("token刷新失败");
    }
  } else if (Number(clientType) === 7) {
    // 小程序中过期跳转至首页
    console.log("跳转小程序");
    wx.miniProgram.reLaunch({ url: `/pages/home/index?isOverDue=1` });
  }
}

// 扫描二维码
async function JSBaddDevice() {
  let res;
  if (isApp) {
    try {
      res = await SaaSBridge.addDevice();
    } catch (error) {
      Toast.info("二维码调用失败");
    }
  }
  return res;
}

// 跳转二级页面

// inside 是否跳转设备关联内部页面
async function openHybridWebview(url, inside, history) {
  let res;
  let newUrl = url;
  let flag = url.includes("http");
  let origin = flag ? "" : window.location.origin;
  if (isApp) {
    try {
      if (inside) {
        newUrl = `${origin}/device/h5${url}`;
      } else {
        newUrl = `${origin}${url}`;
      }
      res = await SaaSBridge.openHybridWebview(newUrl);
    } catch (error) {
      Toast.info("跳转失败");
    }
  } else {
    if (inside) {
      history.push(url);
    } else {
      window.location.href = `${origin}${url}`;
    }
  }
  return res;
}

// 获取用户权限
async function JSBgetPermission() {
  // 0-创建者
  // 1-管理员
  // 2-普通员工
  let res = 1;
  if (isApp) {
    try {
      // 获取用户权限
    } catch (error) {
      Toast.info("用户权限获取失败");
    }
  }
  return res;
}

// 获取appId
async function JSBgetAppId() {
  let appId = "";
  if (isApp) {
    try {
      appId = await SaaSBridge.getAppId();
    } catch (error) {
      console.log("appId获取失败", error);
      // Toast.info("appId获取失败");
    }
  } else {
    // 从路由获取
    appId = Utils.dealRouter(window.location, "appId");
  }
  return appId;
}

// 按协议打开webview
async function JSBopenWebview(params) {
  if (isApp) {
    try {
      await SaaSBridge.openWebview(params);
    } catch (error) {
      Toast.info(`webview打开失败${error}`);
    }
  }
}

// 原生回调方法
async function JSBregister(name, cb) {
  if (isApp) {
    try {
      await SaaSBridge.register(name, cb);
    } catch (error) {
      Toast.info(`原生回调失败${error}`);
    }
  }
}

// 关闭页面（H5容器）
async function JSBgoBackFromH5(callBack) {
  if (isApp) {
    try {
      await SaaSBridge.goBackFromH5();
    } catch (error) {
      Toast.info(`关闭失败${error}`);
    }
  } else {
    callBack();
  }
}

// 保存json { key : value}
async function putJson(key, value, callback) {
  try {
    if (isApp) {
      const result = await SaaSBridge.getData("msgData");
      const data = {
        key: "msgData",
        data: result
          ? { ...JSON.parse(result), [key]: value }
          : { [key]: value },
      };
      try {
        SaaSBridge.setData(JSON.stringify(data));
      } catch (error) {
        Toast.info(`关闭失败${error}`);
      }
    } else {
      const result = localStorage.getItem("msgData");
      const data = result
        ? { ...JSON.parse(result), [key]: value }
        : { [key]: value };
      localStorage.setItem("msgData", JSON.stringify(data));
    }
    callback && callback();
  } catch (error) {
    Toast.info(`错误${error}`);
  }
}

// 通过 key 获取存储在客户端的 json
async function getJson(key) {
  if (isApp) {
    try {
      const res = await SaaSBridge.getData("msgData");
      const result = res ? JSON.parse(res) : {};
      return result[key] || "";
    } catch (error) {
      Toast.info(`关闭失败${error}`);
    }
  } else {
    const res = localStorage.getItem("msgData");
    const result = res ? JSON.parse(res) : {};
    return result[key] || "";
  }
}

// 通过 key 清除存储在客户端的 json
async function clearData(key) {
  if (isApp) {
    try {
      const res = await SaaSBridge.clearData(key);
      return res;
    } catch (error) {
      Toast.info(`关闭失败${error}`);
    }
  }
}

export {
  JSBgetToken,
  JSBgetAccessToken,
  JSBrefreshToken,
  JSBaddDevice,
  JSBgetPermission,
  JSBgetAppId,
  JSBopenWebview,
  JSBregister,
  openHybridWebview,
  JSBgoBackFromH5,
  putJson,
  getJson,
  clearData,
};

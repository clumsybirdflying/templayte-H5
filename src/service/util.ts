import { Toast } from "antd-mobile";
import Utils from "./../util/util";
import { JSBgetToken, JSBrefreshToken, JSBgetAppId } from "./../util/jsbridge";
const token = Utils.dealRouter(window.location, "token");
const clientTypeUrl = Utils.dealRouter(window.location, "clientType");
let appId = "";

let refreshCount: boolean = true;
// 异常处理
function errorHandle(err: any, isToast: boolean) {
  const response = err.response || false;
  let info = "服务繁忙，请稍后重试";
  let type = "serviceError";
  let httpCode: number = 0;

  if (response) {
    const status = response.status;
    switch (true) {
      case status === 401:
        httpCode = 401;
        type = "netError";
        info = "token失效，请重新登录。";
        if (refreshCount) {
          refreshCount = false;
          const refresh = setTimeout(() => {
            refreshCount = true;
            clearTimeout(refresh);
          }, 2000);
          JSBrefreshToken();
        } else {
          console.log("登录过期两秒内已处理，暂不做任何处理");
        }
        break;
      case status === 404:
        httpCode = 404;
        info = "接口异常";
        type = "serviceError";
        break;
      case String(status).indexOf("50") > -1:
        info = "服务繁忙，请稍后重试";
        type = "serviceError";
        break;
      default:
        httpCode = status;
        info = err.msg || "加载失败";
        type = "loadFail";
    }
  } else {
    info = "网络异常，请检查网络设置";
  }
  if (isToast) {
    Toast.info(err.msg || info, 2, () => {}, false);
  }
  err.msg = info;
  err.type = type;
  err.httpCode = httpCode;
  return err;
}

// 获取 token
async function getToken() {
  let current = token;
  if (navigator.userAgent.toLowerCase().match(/ezvizsaas/i)) {
    current = await JSBgetToken();
  } else {
    if (!current) {
      current = localStorage.getItem("token");
    }
  }
  return current;
}

// 获取clientType
async function getClientType() {
  const u = navigator.userAgent;
  let clientType = 2;
  if (!clientTypeUrl) {
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isiOS) {
      clientType = 2;
    } else {
      clientType = 3;
    }
  } else {
    clientType = clientTypeUrl;
  }
  return clientType;
}

// 获取 appId
async function getAppId() {
  if (!appId) {
    appId = await JSBgetAppId();
  }
  return appId;
}

// 设置请求头
async function setHeader(contentType?: string, userType?: string) {
  const token = await getToken();
  const clientType = await getClientType();
  const appId = await getAppId();
  debugger;
  return {
    userType: userType || "enterprise",
    "Content-Type": contentType || "application/json;charset=UTF-8",
    Authorization: "Bearer " + token,
    clientType: clientType,
    appId: appId,
  };
}

/**
 * @param params 参数
 * @returns {*}   返回导出拼接字符串
 */
function paramSerializer(params: any) {
  if (!params) return "";
  const urlPart = [];
  for (const k in params) {
    const value = params[k];
    if (value === null || typeof value === "undefined") continue;
    if (Array.isArray(value)) {
      for (let i = 0, l = value.length; i < l; i++) {
        urlPart.push(k + "=" + value[i]);
      }
    } else {
      urlPart.push(k + "=" + encodeURIComponent(value));
    }
  }
  return urlPart.join("&");
}

export { errorHandle, setHeader, paramSerializer, getToken, getClientType };

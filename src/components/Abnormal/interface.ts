import empty2 from "./../../assets/images/status_empty@2x.png";
import empty3 from "./../../assets/images/status_empty@3x.png";
import error2 from "./../../assets/images/status_error@2x.png";
import error3 from "./../../assets/images/status_error@3x.png";

//  状态图片
export const Status: any = {
  // 加载为空
  empty2,
  empty3,
  // 搜索为空
  searchEmpty2: empty2,
  searchEmpty3: empty3,
  // 404
  load4042: error2,
  load4043: error3,
  // 加载失败
  loadFail2: error2,
  loadFail3: error3,
  // 服务端错误
  serviceError2: error2,
  serviceError3: error3,
  // 网络错误
  netError2: error2,
  netError3: error3,
};

// 状态提示文字
export const StatusText: any = {
  // 加载为空
  empty: "这里空空如也",
  // 搜索为空
  searchEmpty: "没有符合条件的内容",
  // 404
  load404: "加载失败",
  // 加载失败
  loadFail: "加载失败",
  // 服务端错误
  serviceError: "服务繁忙，请稍后重试",
  // 网络错误
  netError: "网络异常，请检查网络设置",
};

// 状态是否有按钮【0-无按钮，1-有按钮】
export const StatusBtn: any = {
  // 加载为空
  empty: "0",
  // 搜索为空
  searchEmpty: "0",
  // 404
  load404: "0",
  // 加载失败
  loadFail: "1",
  // 服务端错误
  serviceError: "1",
  // 网络错误
  netError: "1",
};

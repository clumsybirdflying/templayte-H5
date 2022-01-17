import net from "../net";

// 基础
export interface CommonParams {
  isToast?: boolean; // 是否弹出提示
}

// 获取基础配置
export interface GetConfigParams {
  isToast?: boolean; // 是否弹出提示
}

// 设备告警消息列表
export interface GetMsgParams {
  isToast?: boolean; // 是否弹出提示
  pageNo: number;
  pageSize: number;
  timeOrder?: string; // 更新时间排序：desc-降序 asc-升序
  msgStatus?: number; // 消息状态：-1 全部 0-未处理  1-已处理  2-误报
  startTime?: string; // 开始时间
  endTime?: string; // 结束时间
  groupSerial?: string; // 分组号
  groupDeviceType?: string; // 分组类型
  deviceSerialOrName?: string; // 设备名称、序列号搜素
}

// 消息处理
export interface MsgDealParams {
  isToast?: boolean; // 是否弹出提示
  remarks?: string;
  msgStatus?: number;
  msgId: number;
}

// 消息详情
export interface DetailParams {
  isToast?: boolean; // 是否弹出提示
  msgId: string;
}

// 设备上下线消息列表
export interface MsgStatusListParams {
  isToast?: boolean; // 是否弹出提示
  pageNo: number;
  pageSize: number;
  groupDeviceType: string;
  deviceSerialOrName: string;
}

// 更新消息配置
export interface UpdataH5ConfigParams {
  isToast?: boolean; // 是否弹出提示
  endTime?: string;
  startTime?: string;
  isFree?: number;
  msgOnOffFree?: {
    isFree: number;
  };
}

const api = {
  getConfig: "/api/msg/msg/basic/config/get", // 获取基础配置
  msgList: "/api/msg/dvc/alarm/msg/list", // 设备告警消息列表
  msgDeal: "/api/msg/dvc/alarm/msg/update", // 消息处理
  getDetail: "/api/msg/dvc/alarm/msg/info", // 消息详情
  msgNum: "/api/msg/dvc/alarm/msg/untreated", // 消息未处理、误报数量
  msgStatusList: "/api/resource/dvc/onoff/msg/list", // 设备上下线消息列表
  h5Config: "/api/msg/user/free/v2/h5/info", // 获取消息配置
  updataH5Config: "/api/msg/user/free/v2/h5/update", // 更新消息配置
};

class MessageProvider {
  // 获取基础配置
  async getConfig(params: GetConfigParams) {
    return net.requst(api.getConfig, {
      body: { ...params },
    });
  }

  // 获取设备告警消息列表
  async getMsgList(params: GetMsgParams) {
    if (params.groupSerial === "-1") {
      delete params.groupSerial;
    }
    return net.requst(api.msgList, {
      body: { ...params },
    });
  }

  // 消息处理
  async msgDeal(params: MsgDealParams) {
    return net.requst(api.msgDeal, {
      body: { ...params },
    });
  }

  // 消息详情
  async getDetail(params: DetailParams) {
    return net.requst(api.getDetail, {
      body: { ...params },
    });
  }

  // 消息未处理、误报数量
  async getMsgNum(params: CommonParams) {
    return net.requst(api.msgNum, {
      body: { ...params },
    });
  }

  // 设备上下线消息列表
  async msgStatusList(params: MsgStatusListParams) {
    return net.requst(api.msgStatusList, {
      body: { ...params },
    });
  }

  // 获取H5消息配置
  async h5Config(params: CommonParams) {
    return net.requst(api.h5Config, {
      body: { ...params },
    });
  }

  // 获更新H5消息配置
  async updataH5Config(params: UpdataH5ConfigParams) {
    return net.requst(api.updataH5Config, {
      body: { ...params },
    });
  }
}

export default new MessageProvider();

import { createModel } from "@rematch/core";
import { MessageProvider } from "../../service/api";

import {
  requestStart,
  successHandle,
  handleError,
  dataConfig,
  requestListStart,
  listConfig,
  successListHandle,
  handleListError,
} from "../../contents/commonConfig";
import { DataConfig, ListConfig } from "../../contents/commonInterface";

interface IMessage {
  baseConfig: DataConfig; // 消息基础配置数据
  messageDetail: DataConfig; // 消息详情
  h5Config: DataConfig; // h5消息配置
  msgNumData: DataConfig; // 消息未处理、误报数量
  messageList: ListConfig<any>;
  messageStatusList: ListConfig<any>; // 设备上下线消息列表
  msgStatus: string; // 消息处理状态
  startTime: string;
  endTime: string;
  deviceSerialOrName: string;
}

const messageState: IMessage = {
  baseConfig: dataConfig,
  messageDetail: dataConfig,
  h5Config: dataConfig,
  msgNumData: dataConfig,
  messageList: listConfig,
  messageStatusList: listConfig,
  msgStatus: "-1", // 消息处理状态
  startTime: "",
  endTime: "",
  deviceSerialOrName: "",
};

export const Message = createModel({
  namespace: "message",
  state: messageState,
  effects: {
    // 获取消息基础配置
    async getConfig(payload, state) {
      const target = "baseConfig";
      this.save(requestStart(target));
      const result = await MessageProvider.getConfig({})
        .then((res) => {
          this.save(successHandle({ res, target }));
          return res;
        })
        .catch((err) => {
          this.save(handleError({ error: err, target }));
        });
      return result;
    },

    // 获取消息详情
    async getDetail(payload, state) {
      const target = "messageDetail";
      const { msgId } = payload;
      this.save(requestStart(target));
      const result = await MessageProvider.getDetail({ msgId })
        .then((res) => {
          this.save(successHandle({ res, target }));
          return res;
        })
        .catch((err) => {
          this.save(handleError({ error: err, target }));
        });
      return result;
    },

    // 获取消息未处理、误报数量
    async getMsgNum(payload, state) {
      const target = "msgNumData";
      this.save(requestStart(target));
      const result = await MessageProvider.getMsgNum({})
        .then((res) => {
          this.save(successHandle({ res, target }));
          return res;
        })
        .catch((err) => {
          this.save(handleError({ error: err, target }));
        });
      return result;
    },

    // 获取H5消息配置
    async getH5Config(payload, state) {
      const target = "h5Config";
      this.save(requestStart(target));
      const result = await MessageProvider.h5Config({})
        .then((res) => {
          this.save(successHandle({ res, target }));
          return res;
        })
        .catch((err) => {
          this.save(handleError({ error: err, target }));
        });
      return result;
    },

    // 获取消息列表
    async getMessageList(payload, state) {
      this.save(requestListStart(payload, state.Message, "messageList"));
      this.getMessageData(payload, state);
    },

    // 获取消息列表
    async getMessageData(payload, state) {
      const { pageNo, msgStatus, deviceSerialOrName, selectedGroup } = payload;
      const { messageList, startTime, endTime } = state.Message;
      const { pagination } = messageList;
      const target = "messageList";
      const result = await MessageProvider.getMsgList({
        pageSize: pagination.pageSize,
        pageNo: pageNo || pagination.pageNo,
        msgStatus: Number(msgStatus),
        startTime: startTime ? `${startTime} 00:00:01` : "",
        endTime: endTime ? `${endTime} 23:59:59` : "",
        groupSerial: selectedGroup.groupSerial,
        deviceSerialOrName: deviceSerialOrName,
      })
        .then((res) => {
          this.save(
            successListHandle({ res, payload, state: state.Message, target })
          );
          return res;
        })
        .catch((error) => {
          this.save(
            handleListError({ error, payload, state: state.Message, target })
          );
        });
      return result;
    },

    // 获取设备上下线消息列表
    async getStautsMessageList(payload, state) {
      this.save(requestListStart(payload, state.Message, "messageStatusList"));
      this.getStatusMessageData(payload, state);
    },

    // 获取设备上下线消息列表
    async getStatusMessageData(payload, state) {
      const { pageNo, groupDeviceType, deviceSerialOrName } = payload;
      const { messageStatusList } = state.Message;
      const { pagination } = messageStatusList;
      const target = "messageStatusList";
      const result = await MessageProvider.msgStatusList({
        pageSize: pagination.pageSize,
        pageNo: pageNo || pagination.pageNo,
        groupDeviceType,
        deviceSerialOrName: deviceSerialOrName,
      })
        .then((res) => {
          this.save(
            successListHandle({ res, payload, state: state.Message, target })
          );
          return res;
        })
        .catch((error) => {
          this.save(
            handleListError({ error, payload, state: state.Message, target })
          );
        });
      return result;
    },
  },

  reducers: {
    save(state, payload) {
      console.log("tag-payload", payload);
      return { ...state, ...payload };
    },
  },
});

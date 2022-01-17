import net from "../net";

// 基础
export interface CommonParams {
  isToast?: boolean; // 是否弹出提示
}

const api = {
  deviceType: "/api/resource/dvc/onoff/group/type", // 设备上下线，设备类型
};

class DeviceProvider {
  // 获取设备上下线，设备类型
  async deviceType(params?: CommonParams) {
    return net.requst(api.deviceType, {
      body: { ...params },
    });
  }
}

export default new DeviceProvider();

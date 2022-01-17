// 设备大类
export interface DeviceTypeParams {
  copywriter: string; // 大类名称
  count: number; // 设备数量
  groupDeviceType: string; // 大类编号
}

// 设备详情
export interface DeviceInfoParams {
  id?: string;
  containSubDevice: boolean; // 是否包含子设备
  copywriter: string; // 大类名称
  deviceName: string; // 设备名称
  deviceSerial: string; //设备序列号
  groupDeviceType: string; // 大类编号
  isTrust?: number; // 是否是托管设备
  remarks?: string; // 备注（托管设备才有）
  model: string; // 设备型号
  subDevice: boolean; // 是否是子设备
  subSerial: string; // 子设备序列号
}

// 子设备详情
export interface SubDeviceInfoParams {
  id?: string;
  copywriter: string; // 大类名称
  deviceName: string; // 设备名称
  deviceSerial: string; //设备序列号
  groupDeviceType: string; // 大类编号
  model: string; // 设备型号
  subSerial: string; // 子设备序列号
  isDelete?: number; // 是否
}

// 子通道详情
export interface SubChannelInfoParams {
  id?: string;
  copywriter: string; // 大类名称
  deviceName: string; // 设备名称
  deviceSerial: string; //设备序列号
  groupDeviceType: string; // 大类编号
  model: string; // 设备型号
  subSerial: string; // 子设备序列号
}

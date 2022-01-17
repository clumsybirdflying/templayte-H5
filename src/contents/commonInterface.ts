// 异常状态
export interface AbnormalStatus {
  type:
    | "empty"
    | "searchEmpty"
    | "load404"
    | "loadFail"
    | "serviceError"
    | "netError"
    | string; // 异常类型
  info: string; // 异常信息
  direction?: "down" | "up" | "default"; // down 刷新，up 加载更多 default初始化
}

// 页面状态
export interface PageStatus {
  status: "loading" | "abnormal" | "success" | string; // 状态
  abnormal?: AbnormalStatus;
}

// 异常配置
export interface AbnormalConfig {
  abnormalClass?: string;
  isBlue?: boolean; // 重试是否显示蓝色
  abnormalIsBtn?: boolean;
  abnormalBtnText?: string;
  handleAbnormal?: (e: Object) => void;
}

// 分页
export interface Pagination {
  pageNo: number;
  pageSize: number;
  total: number;
}

// 列表数据
export interface DataConfig extends PageStatus {
  data: any; // 数据
}

// 列表数据
export interface ListConfig<Data> extends PageStatus {
  data: Data[]; // 数据
  hasMore: boolean; // 是否有更多数据
  loading?: boolean; // 刷新
  endLoading?: boolean; // 加载更多
  pagination?: Pagination; // 分页器
}

// card 配置
export interface CardConfig {
  name: string; // 主标题
  mark?: string; // 搜索标红字段
  leftIconShow?: boolean; // 左边图标是否显示
  leftIcon: string; // 设备图标
  info?: string; // 详情
  type: string; // 设备类型 60071
  isLine?: boolean; // 是否在线
  isAbnormal?: boolean; // 是否异常
  isOn?: boolean; // 是否开启
  operateIcon?: string; // 操作图标
  operateImg?: string; // 操作图标图片
  rightIcon?: string; // 右箭头图标
  rightClick?: () => void; // 点击 rightIcon 执行方法
  operateClick?: (item?: any) => void; // 点击 operateIcon 执行方法
  onClick?: () => void; // 点击整体模块执行方法
}

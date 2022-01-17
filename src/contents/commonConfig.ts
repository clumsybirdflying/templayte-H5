export const msgError = "服务异常或网络错误";

// 消息处理状态
export const defaultMsgStatus = {
  "-1": "全部",
  "0": "未处理",
  "1": "已处理",
  "2": "误报",
};

// 默认分页数据
export const defaultPagination = {
  pageNo: 1,
  pageSize: 10,
  total: 0,
};

// 普通接口数据
export const dataConfig = {
  status: "",
  abnormal: undefined,
  data: null, // 数据
};

// 请求开始
export function requestStart(target: string) {
  const result: any = { ...dataConfig, status: "loading" };
  return {
    [target]: result,
  };
}

// 请求成功
export function successHandle(params: any) {
  debugger;
  const { res, target } = params;
  const data = res.data?.list ? res.data?.list : res.data;
  const result = {
    data,
    status: "success",
    abnormal: undefined,
  };
  return {
    [target]: result,
  };
}

// 错误处理
export function handleError(params: any) {
  const { error, target } = params;
  const result = {
    data: null,
    status: "abnormal",
    abnormal: {
      type: error.type,
      info: error.msg,
      direction: "default",
    },
  };
  return {
    [target]: result,
  };
}

// 列表接口数据
export const listConfig = {
  status: "loading",
  abnormal: undefined,
  data: [], // 数据
  loading: false, // 刷新
  endLoading: false, // 加载更多
  hasMore: true, // 是否有更多
  pagination: defaultPagination, // 分页器
};

// 列表接口请求开始
export function requestListStart(payload: any, state: any, target: string) {
  const { type = "", pageNo, pageSize } = payload;
  let result: any = listConfig;
  if (type === "init") {
    result = {
      ...listConfig,
      hasMore: false,
      pagination: {
        ...defaultPagination,
        pageNo: pageNo || defaultPagination.pageNo,
        pageSize: pageSize || defaultPagination.pageSize,
      },
    };
  } else if (type === "refresh") {
    result = {
      ...state[target],
      abnormal: undefined,
      loading: true,
      hasMore: false,
      pagination: {
        ...defaultPagination,
        pageNo: pageNo || defaultPagination.pageNo,
        pageSize: pageSize || defaultPagination.pageSize,
      },
    };
  } else {
    result = {
      ...state[target],
      endLoading: true,
      hasMore: false,
      abnormal: undefined,
      pagination: {
        ...state[target].pagination,
        pageNo: pageNo || state[target].pagination.pageNo,
        pageSize: pageSize || state[target].pagination.pageSize,
      },
    };
  }
  return {
    [target]: result,
  };
}

/**
 * 功能：列表接口调用成功处理
 * @param payload
 * @param curState
 */
export function successListHandle(params: any) {
  const {
    res,
    target,
    state,
    payload,
    emptyText = "暂无数据", // 空数据展示文案
    dealEmpty = true, // 空数据是否异常
  } = params;
  const { type = "", pageNo } = payload;
  let hasMore = true;
  if (res.data.length < state[target].pagination.pageSize) {
    hasMore = false;
  }
  const data = res.data?.list ? res.data?.list : res.data;
  let result: any = {};
  const dealEmptyStatus = dealEmpty && data.length === 0;
  const emptyStatus = dealEmptyStatus
    ? {
        type: "empty",
        info: emptyText,
        direction: "default",
      }
    : undefined;
  console.log("dealEmpty", dealEmpty, dealEmpty);
  if (type === "init") {
    result = {
      ...state[target],
      status: dealEmptyStatus ? "abnormal" : "success",
      abnormal: emptyStatus,
      loading: false,
      hasMore,
      data: [...data],
      pagination: {
        ...state[target].pagination,
        pageNo: pageNo || 2,
        total: res.page?.total,
      },
    };
  } else if (type === "refresh") {
    result = {
      ...state[target],
      data: [...data],
      loading: false,
      hasMore,
      pagination: {
        ...state[target].pagination,
        pageNo: pageNo || 2,
        total: res.page?.total,
      },
    };
  } else {
    result = {
      ...state[target],
      data: pageNo ? [...data] : [...state[target].data, ...data],
      endLoading: false,
      loading: false,
      hasMore,
      pagination: {
        ...state[target].pagination,
        pageNo: pageNo || state[target].pagination.pageNo + 1,
        total: res.page?.total,
      },
    };
  }
  return {
    [target]: result,
  };
}

// 列表接口请求结束
export function handleListError(params: any) {
  const { error, target, state, payload } = params;
  const direciton: any = {
    refresh: "down",
    init: "default",
  };
  const { type = "" } = payload;
  const direction = direciton[type] || "up";
  console.log("error", error.msg);
  const result = {
    ...state[target],
    status: type === "init" ? "abnormal" : state[target].status,
    abnormal: {
      type: error.type,
      info: error.msg,
      direction,
    },
  };
  return {
    [target]: result,
  };
}

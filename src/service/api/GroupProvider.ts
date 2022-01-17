import net from "../net";

// 获取分组列表
export interface groupListParams {
  isToast?: boolean; // 是否弹出提示
  pageNo: number;
  pageSize: number;
  labelIdList?: number[]; // 标签ID
  groupName?: string; // 模糊搜索
}

const api = {
  grouplist: "/api/resource/management/group/list/page", // 获取分组列表
};

class GroupProvider {
  // 获取分组列表
  async getGroupList(params?: groupListParams) {
    return net.requst(api.grouplist, {
      body: { ...params },
    });
  }
}

export default new GroupProvider();

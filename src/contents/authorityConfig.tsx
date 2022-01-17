// 权限配置
import React from "react";
import { authHelper, authHelperKeyParams } from "@ezviz/saas_atom_auth_config";
interface AuthorityContainProps {
  type?: AuthorityType;
  name: AuthorityName;
  children: any;
}

// 限制类型
export enum AuthorityType {
  none = "none", // 隐藏不占用空间
  hidden = "hidden", // 隐藏，占用之前的空间
}

// 约定前端 key
export enum AuthorityName {
  msgUpdate = "alarm_msg_update", // 消息更新状态（操作权限）
}

export const AuthorityContain = (props: AuthorityContainProps) => {
  const falg = Authority.getAuthority(props.name);
  const type = AuthorityType[props.type || AuthorityType.none];
  if (falg) {
    return props.children || <></>;
  }
  if (type === "hidden") {
    return (
      <props.children.type
        style={{ visibility: "hidden" }}
        {...props.children.props}
      />
    );
  }
  return <></>;
};

export const getConfigParams = () => {
  return authHelperKeyParams("device_manage_h5");
};

export default class Authority {
  static getAuthority = (key: AuthorityName) => {
    return Boolean(authHelper(key));
  };
}

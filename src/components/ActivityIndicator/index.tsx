/**
 * 按钮
 */
import React from "react";
import { ActivityIndicator } from "antd-mobile";
import styles from "./index.module.less";

type ActivityProps = {
  actClass?: string;
  actText?: string;
  btnLoading?: boolean;
};

const IActivityIndicator = (props: ActivityProps) => {
  const { actClass = "", actText = "保存", btnLoading = false } = props;
  return (
    <div className={`${styles.activity} ${actClass}`}>
      <ActivityIndicator
        toast
        text={`${actText || "加载"}中`}
        animating={btnLoading}
      />
    </div>
  );
};

export default IActivityIndicator;

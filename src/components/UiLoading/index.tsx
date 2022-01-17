/**
 * 异常处理
 */
import { ActivityIndicator } from "antd-mobile";
import React from "react";
import styles from "./index.module.less";

type LoadingProps = {
  className?: string;
};

const UiLoading = (props: LoadingProps) => {
  const { className = "" } = props;
  return (
    <div className={`${styles.loading} ${className}`}>
      <ActivityIndicator size="large" />
      <span className={styles.text}>正在玩命加载中,请耐心等待</span>
    </div>
  );
};

export default UiLoading;

/**
 * 刷新列表异常
 */
import React from "react";
import styles from "./index.module.less";

type PullAbnormalProps = {
  className?: string;
  icon?: string;
  text?: string;
  isTime?: boolean;
  refreshTime?: any;
  onClick?: (e: Object) => void;
};

const PullAbnormal = (props: PullAbnormalProps) => {
  const { className = "", icon, text, isTime, refreshTime } = props;
  return (
    <div className={`${styles.indicator} ${className}`} onClick={props.onClick}>
      <div>
        <i className={`iconfont ${icon}`} />
        <span>{text}</span>
      </div>
      {isTime && <div>上次刷新时间 {refreshTime}</div>}
    </div>
  );
};

export default PullAbnormal;

/**
 * 页面布局
 */
import React, { ReactNode, memo, useState, useEffect } from "react";
import Abnormal from "../../components/Abnormal";
import NavBar from "../../components/NavBar";
import Mheader from "../../components/Mheader";
import UiLoading from "../../components/UiLoading";
import Utils from "../../util/util";
import styles from "./index.module.less";

// import { ButtonProps } from "./../interface";

import { PageStatus, AbnormalConfig } from "../../contents/commonInterface";

// layout
type PageConfigProps = {
  pageStatus: PageStatus;
  abnormalConfig?: AbnormalConfig;
  isSetInit?: boolean; // 是否设置初始化为成功【初始化无需调接口】
  className?: string; // 重置样式名
  mainClassName?: string; // 内容样式
  isNeedNav?: boolean; // 是否需要h5的header
  title?: string; // 标题
  isGray?: boolean; // 标题背景是否灰色
  leftContent?: string | ReactNode; // 导航栏左边内容
  rightContent?: string | ReactNode; // 导航栏右边内容
  children: string | ReactNode; // 页面内容
};

// footer
interface FooterProps {
  isHasFooter?: boolean; // 是否显示底部按钮
  handleFooter?: (e: Object) => void; // 按钮点击事件
}

const UiLyout = (props: PageConfigProps & FooterProps) => {
  const {
    // page
    pageStatus,
    isSetInit = false,
    // layout
    className = "",
    mainClassName = "",
    isGray,
    abnormalConfig = {},
    leftContent,
    rightContent,
    isHasFooter = false,
    isNeedNav = !Utils.openInWebview(),
    title = "设备管理",
    children,
  } = props;

  const [curStatus, setCurStatus] = useState(isSetInit ? "success" : "");
  useEffect(() => {
    // 页面刚进来的时候，状态为success状态，这个时候刷新 curStatus 状态
    if (!(curStatus === "" && pageStatus.status === "success") || isSetInit) {
      setCurStatus(pageStatus.status);
    }
  }, [pageStatus.status]);

  const content = () => {
    let result: any;
    const { abnormal = { type: "loadFail", info: "加载失败" } } = pageStatus;
    console.log("curStatus", curStatus);
    switch (curStatus) {
      case "loading":
        result = <UiLoading />;
        break;
      case "abnormal":
        result = <Abnormal {...abnormal} {...abnormalConfig} />;
        break;
      case "success":
        result = children;
        break;
      default:
        result = <UiLoading />;
        break;
    }
    return result;
  };

  return (
    <div className={`${styles.page} ${className}`}>
      {/* header */}
      {isNeedNav ? (
        <NavBar
          isGray={isGray}
          title={title}
          leftContent={leftContent}
          rightContent={rightContent}
        />
      ) : (
        <Mheader>{title}</Mheader>
      )}

      {/* main content */}
      <div className={`${styles.main} ${mainClassName}`}>{content()}</div>
      {/* footer */}
      {isHasFooter && <div className={styles.footer}></div>}
    </div>
  );
};

export default memo(UiLyout);

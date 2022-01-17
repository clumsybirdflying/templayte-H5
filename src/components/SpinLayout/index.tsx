/**
 * 页面 组件外部加载框
 */
import React, { memo } from "react";
import UILoading from "../UiLoading";
import Abnormal from "../Abnormal";
import { PageStatus, AbnormalConfig } from "../../contents/commonInterface";

interface SpinLayoutProps {
  pageStatus: PageStatus; //
  abnormalConfig?: AbnormalConfig;
  children: any;
}
const SpinLayout = (props: SpinLayoutProps) => {
  const { pageStatus, abnormalConfig } = props;
  const renderPage = () => {
    const { abnormal = { type: "loadFail", info: "加载失败" } } = pageStatus;
    let pageDom = null;
    switch (pageStatus.status) {
      case "loading":
        pageDom = <UILoading />;
        break;
      case "success":
        pageDom = <>{props.children}</>;
        break;
      case "abnormal":
        console.log("props", props);
        pageDom = <Abnormal {...abnormal} {...abnormalConfig} />;
        break;
      default:
        console.log("没有此状态");
        break;
    }
    return pageDom;
  };
  return renderPage();
};

export default memo(SpinLayout);

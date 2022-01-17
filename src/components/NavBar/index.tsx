import React from "react";
import { NavBar, Icon } from "antd-mobile";
import styles from "./index.module.less";
import { createBrowserHistory } from "history";
const history = createBrowserHistory();

type NavProps = {
  title?: string;
  isGray?: boolean;
  leftContent?: any;
  rightContent?: any;
};

const CommonNav = (props: NavProps) => {
  // 返回
  function onBack() {
    history.go(-1);
  }

  return (
    <div className={styles.header}>
      {props.leftContent || props.rightContent ? (
        <NavBar
          mode="light"
          className={props.isGray ? styles.isGray : ""}
          leftContent={props.leftContent}
          rightContent={props.rightContent}
        >
          <div className={`${styles.title} simpleOverflow`}>{props.title}</div>
        </NavBar>
      ) : (
        <NavBar mode="light" icon={<Icon type={"left"} />} onLeftClick={onBack}>
          <div className={styles.title}>{props.title}</div>
        </NavBar>
      )}
    </div>
  );
};

export default CommonNav;

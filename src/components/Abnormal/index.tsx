/**
 * 异常处理
 */
import React from "react";
import { AbnormalStatus, AbnormalConfig } from "../../contents/commonInterface";
import { Status, StatusText, StatusBtn } from "./interface";
import styles from "./index.module.less";

const Abnormal = (props: AbnormalStatus & AbnormalConfig) => {
  const {
    // 异常
    abnormalClass = "",
    type = "empty",
    info = "",
    abnormalIsBtn,
    abnormalBtnText = "点击重试",
    isBlue = true,
  } = props;
  const img2: any = `${type}2`,
    img3: any = `${type}3`,
    text: any = type,
    btn: any = type;
  console.log(img2);
  return (
    <div
      className={`${styles.abnormal} ${abnormalClass}`}
      onClick={props.handleAbnormal}
    >
      <div className={styles.wrap}>
        <img
          className={styles.img}
          src={`${Status[img2]}`}
          srcSet={`${Status[img2]} 2x,${Status[img3]} 3x`}
          alt=""
        />
      </div>
      <p className={styles.text}>
        <span>{info || StatusText[text]}</span>
        {(abnormalIsBtn || StatusBtn[btn] === "1") && (
          <span className={isBlue ? styles.blue : ""}>{abnormalBtnText}</span>
        )}
      </p>
    </div>
  );
};

export default Abnormal;

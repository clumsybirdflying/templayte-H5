import React from "react";
import { Modal } from "antd-mobile";
import styles from "./index.module.less";

type DialogProps = {
  visible?: any; // 弹窗是否展示
  animationType?: string; // 弹窗弹出动画
  modelClass?: string;
  title?: string; // 弹窗标题
  info?: string; // 弹窗标题
  confirmColor?: string; // 确认按钮颜色
  confirmText?: string; //确认按钮文字
  cancelColor?: string; //取消按钮颜色
  cancelText?: string; //取消按钮文字
  onConfirm?: () => void; // 确定操作事件
  onCancel?: () => void; // 取消操作事件
};

const ConfirmDialog = (props: DialogProps) => {
  const {
    modelClass = "",
    animationType,
    title,
    info,
    confirmText,
    confirmColor,
    cancelColor,
    cancelText,
    visible,
  } = props;
  return (
    <Modal
      visible={visible}
      className={`${styles.confirm} ${title ? "" : styles.min} ${modelClass}`}
      wrapClassName="ica-modal"
      transparent={true}
      maskClosable={false}
      title={title || ""}
      animationType={animationType || "slide-down"}
      footer={[
        {
          text: confirmText || "确定",
          style: { color: confirmColor || "#3e80ff" },
          onPress: props.onConfirm,
        },
        {
          text: cancelText || "取消",
          style: { color: cancelColor || "#999" },
          onPress: props.onCancel,
        },
      ]}
    >
      <p className={styles.info}>{info || "确定删除此设备？"}</p>
    </Modal>
  );
};

export default ConfirmDialog;

import React, { memo, useEffect, useRef } from "react";
import { SearchBar } from "antd-mobile";
import styles from "./index.module.less";

type SearchProps = {
  defaultValue?: string;
  className?: string;
  type?: "white" | "gray"; // 搜索框颜色
  value?: string;
  cancelText?: string;
  placeholder?: string;
  isAutoFocus?: boolean; // 是否自动获取焦点
  disabled?: boolean;
  onClick?: () => void;
  onSubmit?: (val: string) => void;
  onChange?: (val: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onCancel?: (val: string) => void;
  onClear?: (val: string) => void;
};
const ICASearch = (props: SearchProps) => {
  const lv: any = useRef(null);
  useEffect(() => {
    if (props.isAutoFocus && lv && lv.current) {
      lv.current.focus();
    }
  }, []);
  const {
    className = "",
    defaultValue,
    placeholder = "搜索",
    value,
    cancelText,
    disabled = false,
    type = "white",
  } = props;
  return (
    <div
      className={`${styles.searchBar} ${styles[`is-${type}`]} ${className}`}
      onClick={(ele) => {
        if (props.onClick) {
          ele.stopPropagation();
          props.onClick();
        }
      }}
    >
      <SearchBar
        ref={lv}
        defaultValue={defaultValue}
        placeholder={placeholder}
        value={value}
        cancelText={cancelText}
        onSubmit={props.onSubmit}
        onChange={props.onChange}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onCancel={props.onCancel}
        onClear={props.onClear}
        disabled={disabled}
        maxLength={50}
      />
    </div>
  );
};

export default memo(ICASearch);

/**
 * 图片加载
 */
import React, { memo, useState } from "react";
import styles from "./index.module.less";

type ImgLoadProps = {
  className?: string;
  src: string[]; // 图片地址
};

const ImgLoad = (props: ImgLoadProps) => {
  const { className = "", src } = props;
  const [imgSrc, setImgSrc] = useState(src[0]);
  const [imgIndex, setImgIndex] = useState(0);
  // 图片加载成功
  function imgLoad() {
    console.log("图片加载成功");
  }
  // 图片加载失败
  function imgError() {
    setImgIndex((val) => val + 1);
    setImgSrc(src[imgIndex + 1]);
  }
  return (
    <div className={`${styles.imgLayout} ${className}`}>
      <img src={imgSrc} onLoad={imgLoad} onError={imgError} alt="" />
    </div>
  );
};

export default memo(ImgLoad);

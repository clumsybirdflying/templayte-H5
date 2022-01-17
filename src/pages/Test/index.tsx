/*
 * @Description:
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-18 14:41:36
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-18 14:42:53
 */

// 错误示例
import React, { useEffect, useState } from "react";
const Timer = () => {
  const [count, setCount] = useState(10);
  const otherFn = () => {
    console.log("otherFn");
  };
  useEffect(() => {
    const timer = setInterval(() => {
      if (count === 0) {
        clearInterval(timer);
        return;
      }
      console.log("count", count);
      setCount((count) => count - 1);
    }, 1000);
    otherFn(); // 只需要调用一次的方法
    return () => {
      console.log("clean");
      clearInterval(timer);
    };
  }, []); // 避免otherFn多次运行，传入空数组
  return <div>剩余{count}秒</div>;
};

export default Timer;

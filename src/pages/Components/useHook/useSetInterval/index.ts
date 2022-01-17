/*
 * @Description:  setInterval hook
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-17 20:39:46
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-18 14:55:05
 */

import { useEffect, useState } from "react";
import useInterval from "./useInterval";

const Timer = (time: number) => {
  const [count, setCount] = useState<number>(time);
  const otherFn = () => {
    console.log("otherFn");
  };

  useInterval(
    () => {
      setCount(count - 1); // 每次渲染都会走这里，所以count值为最新
    },
    count === 0 ? null : 1000
  );

  useEffect(() => {
    otherFn();
  }, []);

  return count;
};

export default Timer;

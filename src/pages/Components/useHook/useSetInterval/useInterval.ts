/*
 * @Description:
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-17 20:33:05
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-18 14:31:17
 */

import { useEffect } from "react";
import useValuesRef from "./useValuesRef";

const useInterval = (callback: any, delay: number) => {
  const savedCallback = useValuesRef(callback);

  useEffect(() => {
    if (delay !== null) {
      const timer = setInterval(() => {
        savedCallback.current();
      }, delay);
      return () => {
        clearInterval(timer); // delay改变时，旧的timer会被清除
      };
    }
  }, [delay]);
};

export default useInterval;

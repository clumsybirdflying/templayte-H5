/*
 * @Description:
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-17 20:35:42
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-17 20:35:44
 */
import { useRef } from "react";

const useValueRef = (params: any) => {
  const paramsRef = useRef(null);
  paramsRef.current = params;
  return paramsRef;
};

export default useValueRef;

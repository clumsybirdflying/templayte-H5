/*
 * @Description:
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-15 16:27:49
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-15 16:36:00
 */

import React from "react";
import { Input } from "antd-mobile-v5";

import "./index.less";

class InputItem extends React.Component<any, any> {
  render() {
    return <Input className="customInput" {...this.props} />;
  }
}

export default InputItem;

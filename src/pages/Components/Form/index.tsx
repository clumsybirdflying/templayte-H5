/*
 * @Description:
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-15 19:50:57
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-15 19:51:00
 */

import React from "react";
import { Form } from "antd-mobile-v5";

import "./index.less";

class FormC extends React.Component<any, any> {
  render() {
    return <Form className="customForm" {...this.props} />;
  }
}

export default FormC;

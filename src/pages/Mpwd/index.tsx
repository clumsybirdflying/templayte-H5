/*
 * @Description:修改密码
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-17 16:20:39
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-31 16:37:57
 */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Page from "../../components/Page";
import { Button, Form } from "antd-mobile-v5";
import { EyeOutline, EyeInvisibleOutline } from "antd-mobile-icons";
import Input from "../Components/Input";
import { iRootState } from "../../store";

import styles from "./index.module.less";
import util from "../../util/util";
import { useHistory } from "react-router-dom";

type IProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const Mpwd = (props: IProps) => {
  const history = useHistory();
  const [form] = Form.useForm();
  // const id = util.dealRouter(window.location, "id");
  const [loading, setLoading] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdVisible, setPwdVisible] = useState(false);
  const [pwdCVisible, setPwdCVisible] = useState(false);
  const { state } = history.location as any;
  useEffect(() => {
    console.log("获取state", state);
    if (history.action === "PUSH") {
      props.dispatch({
        type: "Mpwd/save",
        payload: {
          page2: {
            // phone: "",
            pwd: "",
            pwdC: "",
          },
        },
      });
    } else {
      form.setFieldsValue({
        pwd: props.page2.pwd,
        pwdc: props.page2.pwdC,
      });
    }
  }, []);

  const handleAbnormal = () => {
    // getMessageDetail();
  };

  const changePwdVisible = () => {
    setPwdVisible((pre: boolean) => !pre);
  };

  const changeCPwdVisible = () => {
    setPwdCVisible((pre) => !pre);
  };

  const onFinish = async (values: any) => {
    console.log("修改密码页", values);
    setLoading(true);
    // const res = await MpwdProvider.getMpwdCode({
    //   mobile: state.phone,
    // });
    await props.dispatch({
      type: "Mpwd/save",
      payload: {
        page2: {
          pwd: values.pwd,
          pwdC: values.pwdc,
        },
      },
    });
    const res = await props.dispatch({
      type: "Mpwd/getMpwdCode",
      payload: {
        phone: state.phone,
      },
    });
    console.log("获取验证码", res);
    setLoading(false);
    if (res && Number(res.code) === 200) {
      history.push("/sms", {
        pwd: values.pwd,
        phone: state.phone,
      });
    }
  };

  return (
    <Page
      mainClassName={styles.loginPage}
      // pageStatus={props.messageDetail}
      pageStatus={{
        status: "success",
      }}
      isSetInit={true}
      abnormalConfig={{ handleAbnormal }}
      title="修改密码"
    >
      <Form
        form={form}
        layout="horizontal"
        className={styles.loginForm}
        onFinish={onFinish}
      >
        <div className="positionR">
          <Form.Item
            label=""
            name="pwd"
            className={`${styles.pwdFormItem}`}
            rules={[
              {
                validator: util.validatePassword,
                required: true,
                validateTrigger: "onBlur",
              },
            ]}
            validateTrigger={["onBlur"]}
          >
            <Input
              maxLength={16}
              placeholder="新密码"
              value={pwd}
              type={pwdVisible ? "text" : "password"}
              clearable
            />
          </Form.Item>
          <span className={styles.visibleBtn} onClick={changePwdVisible}>
            {pwdVisible ? <EyeOutline /> : <EyeInvisibleOutline />}
          </span>
        </div>
        <div className={styles.tips}>
          不少于8位，必须包含数字、英文及特殊符号
        </div>
        <div className="positionR">
          <Form.Item
            label=""
            name="pwdc"
            className={`${styles.pwdFormItem}`}
            rules={[
              {
                required: true,
                message: "请输入确认密码",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (value && getFieldValue("pwd") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("确认密码和新密码不一致");
                },
              }),
            ]}
            validateTrigger={["onBlur"]}
          >
            <Input
              placeholder="确认密码"
              value={pwd}
              type={pwdCVisible ? "text" : "password"}
              clearable
              maxLength={16}
            />
          </Form.Item>
          <span className={styles.visibleBtn} onClick={changeCPwdVisible}>
            {pwdCVisible ? <EyeOutline /> : <EyeInvisibleOutline />}
          </span>
        </div>
        <Form.Item label="">
          <Button
            color="primary"
            block
            type="submit"
            shape="rounded"
            loading={loading}
          >
            发送验证码
          </Button>
        </Form.Item>
      </Form>
    </Page>
  );
};

const mapStateToProps = (state: iRootState) => ({
  // baseConfig: state.Message.baseConfig,
  // messageDetail: state.Message.messageDetail,
  page2: state.Mpwd.page2,
});

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Mpwd);

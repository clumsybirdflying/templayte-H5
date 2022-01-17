/*
 * @Description:
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-16 11:33:03
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2022-01-07 11:09:05
 */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Page from "../../components/Page";
import { Button, Form, Checkbox, Toast } from "antd-mobile-v5";
import {
  EyeOutline,
  EyeInvisibleOutline,
  RightOutline,
} from "antd-mobile-icons";
import CInput from "../Components/Input";
import { iRootState } from "../../store";
import { msgError } from "../../contents/commonConfig";
import { RegisterProvider } from "../../service/api";
import { COUNT } from "../Components/config";

import styles from "./index.module.less";
import util from "../../util/util";
import { useHistory } from "react-router-dom";
import md5 from "md5";

type IProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const Register = (props: IProps) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const { baseConfig } = props;
  const [pwdVisible, setPwdVisible] = useState(false); // 设置密码是否显示
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [count, setCount] = useState(0);
  // const [videoVisible, setVideoVisible] = useState(false); // 播放视频弹窗是否显示
  useEffect(() => {
    // getMessageDetail();
    if (history.action === "PUSH") {
      localStorage.removeItem("registerData");
    } else {
      debugger;
      console.log("查看store中数据", localStorage.getItem("registerData"));
      const registerData = JSON.parse(
        localStorage.getItem("registerData") as string
      );
      if (registerData) {
        form.setFieldsValue({
          phone: registerData.phone,
          pwd: registerData.pwd,
          nickname: registerData.nickname,
          verifyCode: registerData.verifyCode,
        });
      }
    }
  }, []);

  useEffect(() => {
    if (count > 0) {
      setTimeout(() => {
        setCount((c) => c - 1);
      }, 1000);
    }
  }, [count]);

  const handleAbnormal = () => {
    // getMessageDetail();
  };

  const saveData = (obj: any) => {
    console.log("数据保存", obj);
    // Object.keys(obj).forEach((key: string) => {
    //   localStorage.setItem(key, obj[key]);
    // });
    localStorage.setItem("registerData", JSON.stringify(obj));
  };

  const changePwdVisible = () => {
    console.log("密码", pwd);
    setPwdVisible((pre: boolean) => !pre);
  };

  const phoneChange = (value?: string) => {
    setPhone(value ? value : "");
  };

  const pwdChange = (value: string) => {
    setPwd(value);
  };

  const getVerifyCode = async () => {
    console.log("获取短信验证码");
    // const values = form.getFieldsValue();
    // console.log("注册数据", values);
    // await saveData(values);
    // return;
    if (!phone || phone === "") {
      Toast.show("手机号不可为空");
      return;
    }
    const reg = /^1[3456789]\d{9}$/;
    if (!reg.test(phone)) {
      return;
    }
    setCount(COUNT);
    const check = await checkYSIsExist();
    if (check) {
      if (check === "limit") {
        Toast.show("请求过于频繁，请稍后再试");
        return;
      }
      Toast.show("该手机号码已注册，可直接登录");
      return;
    }
    const res = await RegisterProvider.getVerifyCode({
      phone,
    });
    console.log("获取短信结束", props.registerSms, res);
    if (res && Number(res.retcode) === 0) {
      Toast.show("验证码发送成功");
    } else {
      Toast.show(res.msg || "信息错误");
    }
  };

  // 查验手机号是否已注册
  const checkYSIsExist = async () => {
    if (!phone || phone === "") {
      return;
    }
    const reg = /^1[3456789]\d{9}$/;
    if (!reg.test(phone)) {
      return;
    }

    const res = await RegisterProvider.checkYSIsExist({ phone });
    //已注册
    if (res && res.registered) {
      if (res.registered === "limit") {
        return "limit";
      }
      return true;
    } else {
      return false;
    }
  };

  // 校验验证码
  const checkVerifyCode = async () => {
    const { verifyCode } = form.getFieldsValue(["verifyCode"]);
    console.log("获取验证码--", verifyCode);
    const res = await RegisterProvider.checkVerifycode({
      phone,
      smsCode: verifyCode,
    });
    console.log("校验验证码", res);
    if (res && Number(res.retcode) === 0) {
      return true;
    } else {
      Toast.show(res.msg || "验证码有误");
      return false;
    }
  };

  const gotoPage = async (href: string, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    // window.open(href, "_self");
    const values = form.getFieldsValue();
    console.log("注册数据", values);
    await saveData(values);
    window.location.href = href;
  };

  const onFinish = async (values: any) => {
    console.log("get input values", values);
    const checkPhone = await checkYSIsExist();
    if (checkPhone) {
      if (checkPhone === "limit") {
        Toast.show("请求过于频繁，请稍后再试");
        return;
      }
      Toast.show("该手机号码已注册，可直接登录");
      return;
    }
    const checkCode = await checkVerifyCode();
    if (!checkCode) {
      return;
    }
    RegisterProvider.ysUserRegister({
      phone: values.phone,
      smsCode: values.verifyCode,
      password: md5(values.pwd),
    }).then((resp: any) => {
      console.log("注册后的信息", resp);
      if (resp && Number(resp.retcode) === 0) {
        Toast.show("注册成功");
        history.goBack();
      } else {
        Toast.show(resp?.msg || msgError);
      }
    });
  };

  return (
    <Page
      mainClassName={styles.RegisterPage}
      // pageStatus={props.messageDetail}
      pageStatus={{
        status: "success",
      }}
      isSetInit={true}
      abnormalConfig={{ handleAbnormal }}
      title="注册账号"
    >
      <Form
        form={form}
        layout="horizontal"
        className={styles.RegisterForm}
        onFinish={onFinish}
      >
        <div className={styles.positionR}>
          <span className={styles.prefix}>
            +86
            <RightOutline fontSize={14} />
          </span>
        </div>
        <Form.Item
          label=""
          name="phone"
          className={styles.positionR}
          rules={[
            {
              required: true,
              async validator(rule, value) {
                if (!value || !value.trim()) {
                  return Promise.reject("请输入手机号");
                }
                if (value.length < 11) {
                  return Promise.reject("手机号应为11位");
                }
                if (!/^1[3456789]\d{9}$/.test(value)) {
                  return Promise.reject("请输入正确的手机号");
                }
                return Promise.resolve();
              },
            },
          ]}
          validateTrigger={["onBlur"]}
        >
          <CInput
            placeholder="请输入手机号码"
            maxLength={11}
            onChange={phoneChange}
            value={phone}
            clearable
          />
        </Form.Item>
        <div className={styles.positionR}>
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
            <CInput
              maxLength={16}
              placeholder="请设置密码"
              value={pwd}
              onChange={pwdChange}
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
        <Form.Item
          label=""
          name="nickname"
          rules={[
            {
              required: true,
              validator(rule, value) {
                if (!value || !value.trim()) {
                  return Promise.reject("请输入昵称");
                }
                if (/\s+/g.test(value)) {
                  return Promise.reject("昵称不能包含空格");
                }
                if (value.length < 2 || /[%<"\:?/*|&'>]/.test(value)) {
                  return Promise.reject(
                    `昵称长度为2-20位，不能输入%<"\:?/*|&'>`
                  );
                }
                return Promise.resolve();
              },
              whitespace: true,
            },
          ]}
        >
          <CInput placeholder="请输入昵称" maxLength={20} clearable />
        </Form.Item>
        <div className={styles.tips}>
          不超过20个字符，建议使用真实姓名，便于工作交流
        </div>
        <Form.Item
          label=""
          name="verifyCode"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject("请输入验证码"),
            },
          ]}
        >
          <CInput placeholder="请输入短信验证码" maxLength={6} clearable />
        </Form.Item>
        <Form.Item label="">
          {count > 0 ? (
            <div className={styles.tips}>重新获取验证码({count})</div>
          ) : (
            <div
              className={`${styles.tips}`}
              style={{ color: "#3E80FF" }}
              onClick={getVerifyCode}
              // onClick={checkVerifyCode}
            >
              获取验证码
            </div>
          )}
        </Form.Item>
        <Form.Item>
          <Button block type="submit" color="primary" shape="rounded">
            注册
          </Button>
        </Form.Item>
        <div
          className={`${styles.positionR} ${styles.Checkbox} ${styles.height60}`}
        >
          <Form.Item
            label=""
            name="agree"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject("请阅读并同意以上协议"),
              },
            ]}
          >
            <Checkbox></Checkbox>
          </Form.Item>
          <div
            className={`${styles.wrapper} ${styles.positionA} ${styles.xxWrapper}`}
          >
            <span>我已阅读并同意</span>
            <a
              className={styles.rulesA}
              rel="noreferrer"
              target="_blank"
              onTouchStart={(e: any) =>
                gotoPage(
                  `${
                    baseConfig.data?.basic?.serviceProtocol ||
                    "/h5/saasLicense.html"
                  } `,
                  e
                )
              }
            >
              《{baseConfig.data?.basic?.appName || "萤石商业智居"}
              平台服务协议》
            </a>
            <a
              className={styles.rulesA}
              // href={
              //   baseConfig.data?.basic?.privatePolicy || "/saas-policy.html"
              // }
              rel="noreferrer"
              target="_blank"
              onClick={(e: any) =>
                gotoPage(
                  `${
                    baseConfig.data?.basic?.privatePolicy || "/saas-policy.html"
                  } `,
                  e
                )
              }
            >
              《{baseConfig.data?.basic?.appName || "萤石商业智居"}
              平台隐私政策》
            </a>
          </div>
        </div>
      </Form>
    </Page>
  );
};

const mapStateToProps = (state: iRootState) => ({
  baseConfig: state.Login.baseConfig,
  registerSms: state.Register.registerSms,
  // messageDetail: state.Message.messageDetail,
});

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Register);

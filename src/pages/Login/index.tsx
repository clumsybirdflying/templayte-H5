/*
 * @Description: 登录页
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-13 16:34:56
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2022-01-05 15:32:04
 */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Page from "../../components/Page";
import { Button, Toast, Form, Checkbox } from "antd-mobile-v5";
import { EyeOutline, EyeInvisibleOutline } from "antd-mobile-icons";
import Input from "../Components/Input";
import { iRootState } from "../../store";
import { RegisterProvider } from "../../service/api";

import styles from "./index.module.less";
import util from "../../util/util";
import { useHistory } from "react-router-dom";
import qs from "qs";
import md5 from "md5";
import { getClientType } from "../../service/util";

type IProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const Login = (props: IProps) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const { baseConfig } = props;
  const [loading, setLoading] = useState(false);
  const [pwdVisible, setPwdVisible] = useState(false); // 设置密码是否显示
  const [account, setAccount] = useState("");
  const [pwd, setPwd] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [verifyCodeVisible, setVerifyCodeVisible] = useState(false);
  const { state } = history.location as any;
  console.log("url location参数", state);
  useEffect(() => {
    getConfigInfo();
    if (history.action === "PUSH") {
      props.dispatch({
        type: "Mpwd/save",
        payload: {
          pageData: {
            phone: "",
            pwd: "",
          },
        },
      });
    } else {
      debugger;
      console.log(
        "查看store中数据",
        props.pageData,
        localStorage.getItem("phoneData")
      );
      if (!props.pageData.phone && !props.pageData.pwd) {
        if (localStorage.getItem("phoneData")) {
          const data = JSON.parse(localStorage.getItem("phoneData") as string);
          form.setFieldsValue({
            phone: data.phone,
            pwd: data.pwd,
          });
          return;
        }
      }
      form.setFieldsValue({
        phone: props.pageData.phone,
        pwd: props.pageData.pwd,
      });
    }
  }, []);

  const getConfigInfo = async () => {
    props.dispatch({
      type: "Login/getConfigInfo",
      payload: {},
    });
  };

  useEffect(() => {
    console.log("基础配置", baseConfig);
  }, []);

  const handleAbnormal = () => {
    // getMessageDetail();
  };

  const refreshVerifyCode = () => {
    const { phone } = form.getFieldsValue(["phone"]);
    console.log("手机号码", phone);
    if (!phone) {
      Toast.show("请输入手机号");
      return;
    }
    const url = `/openauth/captcha?indexcode=${phone}`;
    setImgUrl(() => {
      return process.env.NODE_ENV === "development"
        ? `${url}&r=${Math.random() * 1000000}`
        : `${window.location.origin}${url}&r=${Math.random() * 1000000}`;
    });
  };

  const changePwdVisible = () => {
    const temp = pwd;
    if (pwdVisible) {
      setPwd(temp);
    } else {
      // setPwd((pre) => pre.replace(""));
    }
    setPwdVisible((pre: boolean) => !pre);
  };

  const saveData = async () => {
    const values = form.getFieldsValue();
    console.log("获取页面数据", values);
    await props.dispatch({
      type: "Login/save",
      payload: {
        pageData: {
          phone: values.phone,
          pwd: values.pwd,
        },
      },
    });
    localStorage.setItem(
      "phoneData",
      JSON.stringify({ phone: values.phone, pwd: values.pwd })
    );
  };

  const gotoRegister = async () => {
    // window.history.replaceState({ ticket: "333333" }, "", "?data=1");
    // return;
    await saveData();
    history.push("/register", {
      testData: "1111",
    });
  };

  const gotoPwd = async () => {
    await saveData();
    history.push("/fpwd");
  };

  const accountChange = (value: string) => {
    setAccount(value);
  };

  const pwdChange = (value: string) => {
    setPwd(value);
  };

  const gotoPage = async (href: string, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    await saveData();
    // window.open(href, "_self");
    window.location.href = href;
  };

  // 查验手机号是否已注册
  const checkYSIsExist = async () => {
    const { phone } = await form.getFieldsValue(["phone"]);
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

  const onFinish = async (values: any) => {
    console.log("登录页参数", values);
    setLoading(true);
    await saveData();
    const checkPhone = await checkYSIsExist();
    if (!checkPhone) {
      Toast.show("手机号未注册");
      setLoading(false);
      return;
    }
    if (checkPhone && checkPhone === "limit") {
      Toast.show("请求过于频繁，请稍后再试");
      setLoading(false);
      return;
    }
    const res = await props.dispatch({
      type: "Login/doLogin",
      payload: {
        phone: values.phone,
        pwd: md5(values.pwd),
        captcha: values.verifycode,
      },
    });
    setLoading(false);
    console.log("获取开放平台数据", res, props.doLoginData);
    if (res && res.retcode && parseInt(res.retcode, 10) === 1005) {
      Toast.show("请输入验证码");
      setVerifyCodeVisible(true);
      refreshVerifyCode();
    } else if (res && res.retcode && parseInt(res.retcode, 10) === 1003) {
      Toast.show({
        content: "验证码错误",
      });
      setVerifyCodeVisible(true);
      refreshVerifyCode();
    } else if (!res || !res.retcode || parseInt(res.retcode, 10) !== 0) {
      const errObj: any = {
        "1001": "用户名或密码错误",
        "1002": "用户名或密码错误",
        "1004": "您的账户已冻结",
        "1006": "硬件特征码sign值错误",
        "1007": "参数不完整",
        "1008": "账户无权限登陆",
        "1025": "登录账号和开发者账号不符或无操作权限,请通过官方邮件申请权限",
      };
      if (verifyCodeVisible) {
        refreshVerifyCode();
      }
      Toast.show({
        content: errObj[res.retcode],
      });
    }

    // 通过萤石云授权码code获取企业萤石云登录token
    if (res && res.retcode && parseInt(res.retcode, 10) === 0) {
      const data = qs.parse(res.redirectUrl.split("?")[1]);
      await props
        .dispatch({
          type: "Login/login",
          payload: {
            ys7_code: data.code,
            ticket: localStorage.getItem("ticket"),
            yunmouUserId: localStorage.getItem("yunmouUserId"),
          },
        })
        .then(async (res: any) => {
          debugger;
          console.log("登录成功后的数据", res);
          console.log(
            "跳转",
            window.location.origin +
              "/device/h5/bwms-corp/list?token=" +
              res.data.token
          );
          console.log("获取token", res.data.token);
          const clientType = await getClientType();
          // window.history.replaceState(
          //   {
          //     ticket: localStorage.getItem("ticket"),
          //     yunmouUserId: localStorage.getItem("yunmouUserId"),
          //     token: res.data.token,
          //   },
          //   "",
          //   `${window.location.origin}/device/h5/bwms-corp/list`
          // );
          localStorage.setItem("token", res.data.token);
          window.location.replace(
            window.location.origin +
              // "https://saastestenterprise.ys7.com" +
              `/device/h5/bwms-corp/list?ticket=${localStorage.getItem(
                "ticket"
              )}&yunmouUserId=${localStorage.getItem(
                "yunmouUserId"
              )}&clientType=${clientType}&token=` +
              res.data.token
          );
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
      title="登录智慧家庭"
    >
      <Form
        form={form}
        layout="horizontal"
        className={styles.loginForm}
        onFinish={onFinish}
      >
        <Form.Item
          label=""
          name="phone"
          rules={[
            {
              required: true,
              async validator(rule, value) {
                if (!value || !value.trim()) {
                  return Promise.reject("请输入手机号");
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
          <Input
            maxLength={11}
            placeholder="手机号码"
            value={account}
            onChange={accountChange}
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
            <Input
              maxLength={16}
              placeholder="密码"
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
        {verifyCodeVisible ? (
          <div className={`${styles.positionR} ${styles.flex}`}>
            <Form.Item
              label=""
              name="verifycode"
              rules={[
                {
                  required: true,
                  async validator(rule, value) {
                    if (!value || !value.trim()) {
                      return Promise.reject("请输入验证码");
                    }
                  },
                },
              ]}
              validateTrigger={["onBlur"]}
            >
              <Input placeholder="请输入验证码" />
            </Form.Item>
            <div onClick={refreshVerifyCode}>
              <img src={imgUrl} alt="请点击刷新" />
            </div>
          </div>
        ) : null}
        <Form.Item>
          <Button
            block
            // disabled={loading}
            loading={loading}
            type="submit"
            color="primary"
            shape="rounded"
          >
            登录
          </Button>
        </Form.Item>
        <Form.Item label="">
          <div className={styles.xxx}>
            <Button color="primary" fill="none" onClick={gotoRegister}>
              注册新用户
            </Button>
            <Button color="primary" fill="none" onClick={gotoPwd}>
              忘记密码
            </Button>
          </div>
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
              onClick={(e: any) =>
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
  doLoginData: state.Login.doLoginData,
  pageData: state.Login.pageData,
});

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Login);

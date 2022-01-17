/*
 * @Description:
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-17 14:10:53
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-31 19:25:53
 */

/*
 * @Description:
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-16 11:33:03
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-16 16:23:18
 */

import React, { useEffect } from "react";
import { connect } from "react-redux";
import Page from "../../components/Page";
import { Button, Form, Toast } from "antd-mobile-v5";
import Input from "../Components/Input";
import { iRootState } from "../../store";
import { RegisterProvider } from "../../service/api";

import styles from "./index.module.less";
import { useHistory } from "react-router-dom";

type IProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const Login = (props: IProps) => {
  const history = useHistory();
  const [form] = Form.useForm();
  useEffect(() => {
    if (history.action === "PUSH") {
      props.dispatch({
        type: "Mpwd/save",
        payload: {
          page1: {
            phone: "",
          },
        },
      });
    } else {
      console.log("重新填入手机号", props.page1);
      form.setFieldsValue({
        phone: props.page1.phone,
      });
    }
  }, []);

  const handleAbnormal = () => {
    // getMessageDetail();
  };

  // 查验手机号是否已注册
  const checkYSIsExist = async () => {
    const { phone } = form.getFieldsValue(["phone"]);
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
    console.log("绑定的手机号", values);
    await props.dispatch({
      type: "Mpwd/save",
      payload: {
        page1: {
          phone: values.phone,
        },
      },
    });
    // history.push("/mpwd", {
    //   phone: values.phone,
    // });
    // return;
    const phoneCheck: any = await checkYSIsExist();
    if (phoneCheck) {
      if (phoneCheck === "limit") {
        Toast.show("请求过于频繁，请稍后再试");
        return;
      }
      history.push("/mpwd", {
        phone: values.phone,
      });
      return;
    } else {
      Toast.show("手机号未注册");
      return;
    }
  };

  return (
    <Page
      mainClassName={styles.FpwdPage}
      // pageStatus={props.messageDetail}
      pageStatus={{
        status: "success",
      }}
      isSetInit={true}
      abnormalConfig={{ handleAbnormal }}
      title="忘记密码"
    >
      <Form
        form={form}
        layout="horizontal"
        className={styles.FpwdForm}
        onFinish={onFinish}
      >
        <div className={styles.subTitle}>输入绑定的手机号</div>
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
                if (!/^1[3456789]\d{9}$/.test(value)) {
                  return Promise.reject("请输入正确的手机号");
                }
                return Promise.resolve();
              },
            },
          ]}
          validateTrigger={["onBlur"]}
        >
          <Input placeholder="请输入手机号码" maxLength={11} clearable />
        </Form.Item>
        <Form.Item>
          <Button block type="submit" color="primary" shape="rounded">
            修改密码
          </Button>
        </Form.Item>
      </Form>
    </Page>
  );
};

const mapStateToProps = (state: iRootState) => ({
  // baseConfig: state.Message.baseConfig,
  // messageDetail: state.Message.messageDetail,
  page1: state.Mpwd.page1,
});

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Login);

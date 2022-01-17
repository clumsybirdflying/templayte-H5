/*
 * @Description: 短信验证
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-17 16:41:17
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2022-01-04 10:21:46
 */

import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import Page from "../../components/Page";
import { Toast, Form, PasscodeInput } from "antd-mobile-v5";
import { iRootState } from "../../store";

import { MpwdProvider } from "../../service/api";

import styles from "./index.module.less";
import { useHistory } from "react-router-dom";
import { COUNT } from "../Components/config";

type IProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const SMS = (props: IProps) => {
  let Timer: any;
  const history = useHistory();
  const [form] = Form.useForm();
  const [count, setCount] = useState<number>(COUNT); //计时器
  const { state } = history.location as any;
  useEffect(() => {
    // getMessageDetail();
    console.log("短信验证", state);
  }, []);

  useEffect(() => {
    Timer && clearInterval(Timer);
    return () => clearInterval(Timer);
  }, []);

  useEffect(() => {
    if (count > 0)
      Timer = setTimeout(() => setCount((count: any) => --count), 1000);
    else if (count === 0) clearTimeout(Timer);
  }, [count]);

  const handleAbnormal = () => {
    // getMessageDetail();
  };

  const getVerifyCode = async () => {
    setCount(COUNT);
    await props.dispatch({
      type: "Mpwd/getMpwdCode",
      payload: {
        phone: state.phone,
      },
    });
  };

  // 密码重置之前校验验证码的正确性
  const resetPassword = useCallback(async (value: any) => {
    console.log("密码修改-获取验证码", value);

    const checkSmsRes = await MpwdProvider.checkSms({
      mobile: state.phone,
      validateCode: value,
    });
    if (!checkSmsRes || Number(checkSmsRes.code) !== 200) {
      return;
    }
    const res = await props.dispatch({
      type: "Mpwd/resetPassword",
      payload: {
        phone: state.phone,
        pwd: state.pwd,
        verifyCode: value,
      },
    });
    if (res && Number(res.code) === 200) {
      Toast.show({
        // icon: "success",
        content: "密码修改成功",
      });
      history.replace("/login");
    }
    console.log("密码修改-结束", checkSmsRes);
  }, []);

  return (
    <Page
      mainClassName={styles.commonPage}
      pageStatus={{
        status: "success",
      }}
      isSetInit={true}
      abnormalConfig={{ handleAbnormal }}
      title="短信验证"
    >
      <Form form={form} layout="horizontal" className={styles.loginForm}>
        <div className={`${styles.subTitle} ${styles.alignLeft}`}>
          为了确保信息安全，请输入短信验证码，验证码将发送至
          {state.phone?.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")}
          {/* {state.phone} */}
        </div>
        <div className={`${styles.subTitle}`}>请输入4位数字验证码</div>
        <div className={styles.pwdWrapper}>
          <Form.Item label="" className={styles.pwdFormItem}>
            <PasscodeInput length={4} plain seperated onFill={resetPassword} />
          </Form.Item>
        </div>
        <div className={styles.tips}></div>
        {count > 0 ? (
          <div className={styles.tips}>重新获取验证码({count})</div>
        ) : (
          <div
            className={`${styles.tips}`}
            style={{ color: "#3E80FF" }}
            onClick={getVerifyCode}
          >
            获取验证码
          </div>
        )}
      </Form>
    </Page>
  );
};

const mapStateToProps = (state: iRootState) => ({
  // baseConfig: state.Message.baseConfig,
  // messageDetail: state.Message.messageDetail,
});

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(SMS);

/*
 * @Description:跳转中间页
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-20 10:07:55
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2022-01-05 11:19:49
 */

import React, { useEffect } from "react";
import { connect } from "react-redux";
import Page from "../../components/Page";
import { iRootState } from "../../store";

import styles from "./index.module.less";
import util from "../../util/util";
import { useHistory } from "react-router-dom";
import { getClientType } from "../../service/util";

type IProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const Home = (props: IProps) => {
  const history = useHistory();
  const ticket = util.dealRouter(window.location, "ticket");
  console.log("首页获取ticket", ticket);
  localStorage.setItem("ticket", ticket);
  debugger;
  useEffect(() => {
    tokenCheck();
  }, []);

  const tokenCheck = async () => {
    const res = await props.dispatch({
      type: "LoginCheck/getToken",
      payload: { ticket },
    });
    const clientType = await getClientType();
    if (res && res.data) {
      localStorage.setItem("yunmouUserId", res.data.yunmouUserId);
      localStorage.setItem("token", res.data.token);
      if (res.data.token) {
        window.location.replace(
          window.location.origin +
            // "https://saastestenterprise.ys7.com" +
            `/device/h5/bwms-corp/list?ticket=${ticket}&yunmouUserId=${res.data.yunmouUserId}&clientType=${clientType}&token=` +
            res.data.token
        );
        return;
      } else {
        history.replace("/login", {
          ticket,
        });
      }
    } else {
      history.replace("/login", {
        ticket,
      });
    }
  };

  const handleAbnormal = () => {
    // getMessageDetail();
  };

  return (
    <Page
      mainClassName={styles.loginPage}
      pageStatus={props.tokenData}
      isSetInit={true}
      abnormalConfig={{ handleAbnormal }}
      title="登录智慧家庭"
    >
      <div className=""></div>
    </Page>
  );
};

const mapStateToProps = (state: iRootState) => ({
  tokenData: state.LoginCheck.tokenData,
});

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Home);

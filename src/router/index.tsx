/*
 * @Description: router
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-13 10:05:43
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-27 14:07:58
 */
import React, { Suspense } from "react";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import { ActivityIndicator } from "antd-mobile";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Fpwd from "../pages/Fpwd";
import Mpwd from "../pages/Mpwd";
import Sms from "../pages/SMS";
// import { iRootState } from "../store";
import { connect } from "react-redux";
const Loading = () => {
  return <ActivityIndicator toast>加载中...</ActivityIndicator>;
};

// type IProps = ReturnType<typeof mapStateToProps> &
//   ReturnType<typeof mapDispatchToProps>;

const AppRouter = (props: any) => {
  return (
    <Router basename={`${process.env.PUBLIC_URL}`}>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/fpwd" exact component={Fpwd} />
          <Route path="/mpwd" exact component={Mpwd} />
          <Route path="/sms" exact component={Sms} />
          <Redirect to="/login" />
        </Switch>
      </Suspense>
    </Router>
  );
};
// const mapStateToProps = (state: iRootState) => ({
//   baseConfig: state.Message.baseConfig,
// });

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

export default connect(mapDispatchToProps)(AppRouter);
// export default AppRouter;

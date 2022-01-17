import React, { useEffect } from "react";
import { connect } from "react-redux";
import Page from "../../components/Page";
import { iRootState } from "../../store";
import SpinLayout from "../../components/SpinLayout";
import AppHead from "./Layout/Head";
import AppGoup from "./Layout/Group";
import AppFilter from "./Layout/Filter";
import AppList from "./Layout/List";

// import styles from "./index.module.less";

type IProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const App = (props: IProps) => {
  const { baseConfig } = props;
  const flag = Boolean(baseConfig?.data?.dataStatus); // 是否开通消息处理功能
  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = () => {
    // props.dispatch({
    //   type: "Message/getConfig",
    //   payload: {},
    // });
    props.dispatch({
      type: "Message/getMsgNum",
      payload: {},
    });
  };

  const handleAbnoraml = () => {
    getInfo();
  };

  return (
    <Page pageStatus={{ status: "success" }} isSetInit={true} title="设备消息">
      <AppHead />
      <SpinLayout
        pageStatus={baseConfig}
        abnormalConfig={{ handleAbnormal: handleAbnoraml }}
      >
        {flag && <AppFilter />}
        <AppGoup />
        <AppList />
      </SpinLayout>
    </Page>
  );
};

const mapStateToProps = (state: iRootState) => ({
  baseConfig: state.Message.baseConfig,
});

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(App);

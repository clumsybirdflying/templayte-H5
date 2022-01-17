import React, { useEffect } from "react";
import { connect } from "react-redux";
import SpinLayout from "../../../../components/SpinLayout";
import RefreshList from "../../../../components/RefreshList";
import { iRootState } from "../../../../store";

import styles from "./index.module.less";
import moment from "moment";
import ImgLoad from "../../../../components/ImgLoad";
import DefaultImg from "../../../../assets/images/wushebei-small.png";
import { defaultMsgStatus } from "../../../../contents/commonConfig";
import { useHistory } from "react-router-dom";

type IProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const AppList = (props: IProps) => {
  const history = useHistory();
  const { messageList, msgStatus, selectedGroup, baseConfig } = props;
  const flag = Boolean(baseConfig?.data?.dataStatus); // 是否开通消息处理功能
  useEffect(() => {
    getInfo("init");
  }, []);

  const getInfo = async (type: string) => {
    props.dispatch({
      type: "Message/getMessageList",
      payload: {
        type,
        msgStatus,
        deviceSerialOrName: "",
        selectedGroup,
      },
    });
  };

  const onRefresh = () => {
    getInfo("refresh");
  };

  const onEndReached = (refresh: boolean) => {
    if (messageList.hasMore === true) {
      getInfo("");
    }
  };

  const handleAbnoraml = () => {
    getInfo("init");
  };

  const gotoDetail = (data: any) => {
    console.log("data", data);
    history.push(`/detail?id=${data.msgId}`);
  };

  // 列表元
  const renderRow = (
    item: any,
    sectionID: React.ReactText,
    rowID: React.ReactText
  ) => {
    return (
      <div
        key={rowID}
        className={styles.itemLayout}
        onClick={() => gotoDetail(item)}
      >
        <div className={styles.imgContain}>
          <ImgLoad
            src={[
              item.picUrl,
              `https://statics.ys7.com/device/image/${item?.deviceInfo?.model}/2.png`,
              DefaultImg,
            ]}
            className={styles.deviceImg}
          />
          {item?.deviceInfo?.isCamera ? (
            <i className="iconfont iconicn_bofang" />
          ) : (
            ""
          )}
        </div>
        <div className={styles.rightItem}>
          <div className={styles.titleLayout}>
            <span className={`${styles.msgTitle} simpleOverflow`}>
              {item.msgTitle}
            </span>
            <span className={styles.time}>
              {moment(item.alarmTime).format("MM-DD HH:mm")}
            </span>
          </div>
          <div className={`${styles.deviceName} simpleOverflow`}>
            {item.channelName}
          </div>
          <div className={styles.statusLayout}>
            <span>序列号{item.deviceSerial}</span>
          </div>
          {flag && (
            <div
              className={`${styles.msgStatus} ${
                styles[`color${item.msgStatus}`]
              }`}
            >
              {(defaultMsgStatus as any)[String(item.msgStatus)]}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.appList}>
      <SpinLayout
        pageStatus={messageList}
        abnormalConfig={{ handleAbnormal: handleAbnoraml }}
      >
        <RefreshList
          dataSource={messageList.data}
          isLoading={messageList.loading || false}
          hasMore={messageList.hasMore}
          isEndError={messageList.abnormal?.direction === "up"}
          isError={messageList.abnormal?.direction === "down"}
          onRefresh={onRefresh}
          onEndReached={(refresh) => onEndReached(refresh)}
          renderRow={renderRow}
        />
      </SpinLayout>
    </div>
  );
};

const mapStateToProps = (state: iRootState) => ({
  msgStatus: state.Message.msgStatus,
  messageList: state.Message.messageList,
  selectedGroup: state.Group.selectedGroup,
  baseConfig: state.Message.baseConfig,
});

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(AppList);

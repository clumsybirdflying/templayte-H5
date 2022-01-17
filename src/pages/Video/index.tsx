import React, { useEffect } from "react";
import { connect } from "react-redux";
import Page from "../../components/Page";
import styles from "./index.module.less";
import { iRootState } from "../../store";
import moment from "moment";
import EZUIKit from "ezuikit-js";

type IProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

let playr: any;
const Video = (props: IProps) => {
  const { messageDetail } = props;
  console.log("messageDetail", messageDetail);
  // const yzm = "EUXRYO" || "UKTLNA";
  // const deviceSerial = "E21631277" || "E78094747";
  const begin = moment(messageDetail?.data?.alarmTime - 30000).format(
    "YYYYMMDDHHmm"
  );
  const end = moment(messageDetail?.data?.alarmTime + 30000).format(
    "YYYYMMDDHHmm"
  );
  const cloudStatus = Boolean(
    messageDetail?.data?.deviceInfo?.cloudStatus === 1
  );
  let url = `ezopen://${messageDetail?.data?.deviceInfo?.validateCode}@open.ys7.com/${messageDetail?.data?.deviceSerial}/${messageDetail?.data?.deviceInfo?.channelNo}.rec?begin=${begin}&end=${end}`;
  if (cloudStatus) {
    url = `ezopen://${messageDetail?.data?.deviceInfo?.validateCode}@open.ys7.com/${messageDetail?.data?.deviceSerial}/${messageDetail?.data?.deviceInfo?.channelNo}.cloud.rec?begin=${begin}&end=${end}`;
  }
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const url = `ezopen://${messageDetail?.data?.deviceInfo?.validateCode}@open.ys7.com/${messageDetail?.data?.deviceSerial}/1.rec?begin=${begin}&end=${end}`;
    // const url1 = `ezopen://${content?.deviceInfo?.validateCode}@open.ys7.com/${content?.deviceSerial}/1.live`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    playr = new EZUIKit.EZUIKitPlayer({
      id: "video-container", // 视频容器ID
      accessToken: messageDetail?.data?.accessToken,
      url: url,
      template: "simple", // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
      // 视频上方头部控件
      // header: ['capturePicture','save'],            // 如果templete参数不为simple,该字段将被覆盖
      // // 视频下方底部控件
      // footer: ['talk','broadcast','hd','fullScreen'],      // 如果template参数不为simple,该字段将被覆盖
      // footer: ["fullScreen"], // 如果template参数不为simple,该字段将被覆盖
      // plugin: ["talk"],
      audio: 1, // 是否默认开启声音 0 - 关闭 1 - 开启
      bSupporDoubleClickFull: false,
      openSoundCallBack: (data: any) => console.log("开启声音回调", data),
      closeSoundCallBack: (data: any) => console.log("关闭声音回调", data),
      startSaveCallBack: (data: any) => console.log("开始录像回调", data),
      stopSaveCallBack: (data: any) => console.log("录像回调", data),
      capturePictureCallBack: (data: any) => console.log("截图成功回调", data),
      fullScreenCallBack: (data: any) => console.log("全屏回调", data),
      getOSDTimeCallBack: (data: any) => console.log("获取OSDTime回调", data),
      // width: playrWidth,
      height: 210,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Page
      pageStatus={{ status: "success" }}
      isSetInit={true}
      title="视频播放"
      mainClassName={styles.videoMain}
    >
      <div
        id="video-container"
        className="video-detail__container"
        style={{
          width: "100%",
          height: "auto",
          paddingBottom: "36px",
        }}
      ></div>
    </Page>
  );
};

const mapStateToProps = (state: iRootState) => ({
  messageDetail: state.Message.messageDetail,
});

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Video);

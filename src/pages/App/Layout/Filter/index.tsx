import React from "react";
import { connect } from "react-redux";
import styles from "./index.module.less";
import { iRootState } from "../../../../store";

type IProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const Filter = (props: IProps) => {
  const { selectedGroup, msgStatus, msgNumData } = props;
  const objArr = [
    {
      name: "全部",
      value: "-1",
    },
    {
      name: `未处理(${
        Number(msgNumData?.data?.unReadNum || 0) > 99
          ? "99+"
          : Number(msgNumData?.data?.unReadNum || 0)
      })`,
      value: "0",
    },
    {
      name: "已处理",
      value: "1",
    },
    {
      name: `误报(${
        Number(msgNumData?.data?.misReportNum || 0) > 99
          ? "99+"
          : Number(msgNumData?.data?.misReportNum || 0)
      })`,
      value: "2",
    },
  ];
  const getMessage = async (type: string, status: any) => {
    props.dispatch({
      type: "Message/getMessageList",
      payload: {
        type,
        msgStatus: status,
        deviceSerialOrName: "",
        selectedGroup,
      },
    });
  };

  const switchStatus = (item: any) => {
    props.dispatch({
      type: "Message/save",
      payload: {
        msgStatus: item.value,
      },
    });
    getMessage("init", item.value);
  };

  return (
    <div className={styles.appFilter}>
      {objArr.map((item: any, index: number) => {
        return (
          <div
            key={index}
            className={`${styles.filterItem} ${
              msgStatus === item.value ? styles.active : ""
            }`}
            onClick={() => switchStatus(item)}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state: iRootState) => ({
  msgStatus: state.Message.msgStatus,
  selectedGroup: state.Group.selectedGroup,
  msgNumData: state.Message.msgNumData,
});

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Filter);

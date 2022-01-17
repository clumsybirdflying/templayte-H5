import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styles from "./index.module.less";
import { iRootState } from "../../../../store";
import SpinLayout from "../../../../components/SpinLayout";
import RefreshList from "../../../../components/RefreshList";
import { Popover } from "antd-mobile";

type IProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const Group = (props: IProps) => {
  const { groupList, selectedGroup, msgStatus } = props;
  const [visible, setVisible] = useState(false);
  const [list, setList] = useState<any>([]);

  useEffect(() => {
    getInfo("init");
  }, []);

  useEffect(() => {
    console.log("改变分组");
    const newList = JSON.parse(JSON.stringify(groupList.data));
    setList(newList);
  }, [selectedGroup, groupList]);

  const getInfo = async (type: string) => {
    props.dispatch({
      type: "Group/getGroupList",
      payload: {
        type,
      },
    });
  };

  const onRefresh = () => {
    getInfo("refresh");
  };

  const onEndReached = (refresh: boolean) => {
    if (groupList.hasMore === true) {
      getInfo("");
    }
  };

  const handleAbnoraml = () => {
    getInfo("init");
  };

  const getMessage = async (type: string, group: any) => {
    props.dispatch({
      type: "Message/getMessageList",
      payload: {
        type,
        msgStatus,
        deviceSerialOrName: "",
        selectedGroup: group,
      },
    });
  };

  const switchGroup = (row: any) => {
    setVisible(false);
    props.dispatch({
      type: "Group/save",
      payload: {
        selectedGroup: row,
      },
    });
    getMessage("init", row);
  };

  // 列表元
  const renderRow = (
    rowData: any,
    sectionID: React.ReactText,
    rowID: React.ReactText
  ) => {
    const { selectedGroup } = props;
    console.log(selectedGroup.groupSerial, rowData.groupSerial);
    return (
      <div
        key={rowID}
        className={`${styles.item} ${
          selectedGroup.groupSerial === rowData.groupSerial ? styles.active : ""
        }`}
        onClick={() => switchGroup(rowData)}
      >
        {rowData.groupName}
      </div>
    );
  };

  console.log("groupList.data", groupList.data);
  return (
    <div className={styles.appGoup}>
      <div
        onClick={() => {
          if (!visible) {
            getInfo("init");
          }
          setVisible(!visible);
        }}
      >
        <Popover
          placement="bottom"
          overlay={
            <div className={styles.layout}>
              <SpinLayout
                pageStatus={groupList}
                abnormalConfig={{ handleAbnormal: handleAbnoraml }}
              >
                <RefreshList
                  dataSource={list}
                  isLoading={groupList.loading || false}
                  hasMore={groupList.hasMore}
                  isEndError={groupList.abnormal?.direction === "up"}
                  isError={groupList.abnormal?.direction === "down"}
                  onRefresh={onRefresh}
                  onEndReached={(refresh) => onEndReached(refresh)}
                  renderRow={renderRow}
                />
              </SpinLayout>
            </div>
          }
          visible={visible}
        >
          <div className={styles.contentLayout}>
            <p className={styles.title}>{selectedGroup.groupName}</p>
            <i className="iconfont iconicn_triangle_down_1_nor2x"></i>
          </div>
        </Popover>
      </div>
    </div>
  );
};

const mapStateToProps = (state: iRootState) => ({
  groupList: state.Group.groupList,
  selectedGroup: state.Group.selectedGroup,
  msgStatus: state.Message.msgStatus,
});

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Group);

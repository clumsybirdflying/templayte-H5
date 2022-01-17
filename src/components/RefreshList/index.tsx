import React, { memo, useEffect, useRef, useState } from "react";
import { ListView, PullToRefresh } from "antd-mobile";
import moment from "moment";
import PullListAbnormal from "../PullListAbnormal";
import styles from "./index.module.less";

type ListProps = {
  className?: string;
  listH?: number; // 当前展示高度
  // 状态
  pageStatus?: string; //页面状态
  // 数据
  isSearch?: boolean; // 是否为搜多列表
  isLoading: boolean; // indicator加载中
  isError?: boolean; // indicator错误状态
  isEndLoading?: boolean; // footer加载中
  isEndError?: boolean; // footer错误状态
  hasMore: boolean; // 是否有更多数据
  dataSource: any; // 列表数据
  renderRow: any; // 列表项
  renderHeader?: () => any; // 列表header
  // 列表操作
  onRefresh: () => void; // 刷新
  onEndReached?: (refresh: any) => void; // 上拉加载
  handleAbnoraml?: (e: Object) => void; // 错误处理
};

const PullList = (props: ListProps) => {
  const {
    className = "",
    dataSource,
    renderRow,
    isLoading,
    renderHeader,
    onEndReached,
    onRefresh,
    isEndLoading,
    isEndError,
    hasMore,
    isError = false,
  } = props;
  const [data, setData] = useState(
    new ListView.DataSource({
      rowHasChanged: (row1: any, row2: any) => row1 !== row2,
    })
  );
  const [refreshTime, setTime] = useState("");
  const [wrapH, setWrapH] = useState(0);
  const [listH, setListH] = useState(0);
  const lv: any = useRef(null);

  useEffect(() => {
    setData(data.cloneWithRows(dataSource));
    setTime(moment().format("HH:mm:ss"));
  }, [props.dataSource]);

  useEffect(() => {
    if (lv && lv.current) {
      setWrapH(lv.current.getInnerViewNode().parentElement.clientHeight);
      setListH(lv.current.getInnerViewNode().clientHeight);
    }
  }, [data]);

  const renderIndicator = () => {
    console.log("isError", isError);
    const indicator = {
      activate: <PullListAbnormal icon="ica-refresh-up" text="释放刷新" />,
      deactivate: <PullListAbnormal icon="ica-refresh-up" text="释放刷新" />,
      release: isError ? (
        <PullListAbnormal
          className={styles.error}
          icon="ica-refresh-fail"
          text="刷新失败,请重试"
          onClick={onRefresh}
        />
      ) : (
        <PullListAbnormal
          icon="iconloading"
          text="正在刷新"
          isTime={true}
          refreshTime={refreshTime}
        />
      ),
      finish: isError ? (
        <PullListAbnormal
          className={styles.error}
          icon="ica-refresh-fail"
          text="刷新失败,请重试"
          onClick={onRefresh}
        />
      ) : (
        <PullListAbnormal
          icon="ica-refreshed"
          text="刷新完成"
          isTime={true}
          refreshTime={refreshTime}
        />
      ),
    };
    return indicator;
  };

  const renderFooter = () => {
    let result: any;
    if (isEndError) {
      result = (
        <PullListAbnormal
          className={styles.error}
          icon="ica-refresh-fail"
          text="加载失败，点击重试"
          isTime={true}
          refreshTime={refreshTime}
          onClick={() => onEndReached && onEndReached(true)}
        />
      );
    } else if (isEndLoading) {
      result = (
        <PullListAbnormal
          icon="iconloading"
          text="正在加载"
          isTime={true}
          refreshTime={refreshTime}
        />
      );
    } else if (dataSource.length > 0 && !hasMore && wrapH < listH) {
      result = "已加载全部数据";
    } else {
      result = "";
    }
    return result;
  };

  return (
    <ListView
      ref={lv}
      className={`${styles.pull} ${className}`}
      dataSource={data}
      renderRow={renderRow}
      pullToRefresh={
        <PullToRefresh
          direction="down"
          refreshing={isLoading}
          onRefresh={onRefresh}
          indicator={renderIndicator()}
          distanceToRefresh={70} //刷新距离
          damping={80} //拉动距离限制, 建议小于 200
          getScrollContainer={() => ""}
        />
      }
      renderHeader={renderHeader ? renderHeader() : ""}
      renderFooter={renderFooter}
      pageSize={4}
      initialListSize={100}
      scrollRenderAheadDistance={500}
      onEndReached={() => onEndReached && onEndReached(false)}
    />
  );
};

export default memo(PullList);

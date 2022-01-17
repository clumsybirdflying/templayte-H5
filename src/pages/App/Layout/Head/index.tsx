import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import styles from "./index.module.less";
import { iRootState } from "../../../../store";
import SearchBar from "../../../../components/SearchBar";

type IProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const Head = (props: IProps) => {
  const history = useHistory();
  // 搜索
  const handleSearch = () => {
    history.push("/search");
  };
  // 跳转消息设置页面
  const onGotoSet = () => {
    history.push("/set");
  };
  // 跳转设备上下线消息页面
  const onGotoStatus = () => {
    history.push("/status");
  };

  return (
    <div className={styles.appHead}>
      <SearchBar
        className={styles.search}
        value=""
        onClick={handleSearch}
        disabled={true}
        placeholder="输入设备名称/序列号进行精确搜索"
      />
      <i className="iconfont iconicn_shebeixiaoxi" onClick={onGotoStatus} />
      <i className="iconfont iconicn_peizhi" onClick={onGotoSet} />
    </div>
  );
};

const mapStateToProps = (state: iRootState) => ({});

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Head);

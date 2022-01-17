import React from "react";

export default class Mheader extends React.Component<any, any> {
  componentWillMount() {
    document.title = this.props.title || this.props.children;
  }
  render() {
    return null;
  }
}

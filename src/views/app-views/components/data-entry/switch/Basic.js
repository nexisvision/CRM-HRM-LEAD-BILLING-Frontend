import React, { Component } from "react";
import { Switch } from "antd";

function onChange(checked) {
}

export class Basic extends Component {
  render() {
    return <Switch defaultChecked onChange={onChange} />;
  }
}

export default Basic;

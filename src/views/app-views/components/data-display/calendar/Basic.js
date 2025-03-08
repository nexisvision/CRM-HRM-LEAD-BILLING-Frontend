import React, { Component } from "react";
import { Calendar } from "antd";

function onPanelChange(value, mode) {
}

export class Basic extends Component {
  render() {
    return <Calendar onPanelChange={onPanelChange} />;
  }
}

export default Basic;

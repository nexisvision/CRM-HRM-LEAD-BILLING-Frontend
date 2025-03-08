import React, { Component } from "react";
import { Popconfirm, message } from "antd";

function confirm(e) {
  message.success("Click on Yes");
}

function cancel(e) {
  message.error("Click on No");
}

export class Basic extends Component {
  render() {
    return (
      <Popconfirm
        title="Are you sure delete this task?"
        onConfirm={confirm}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <a href="/#">Delete</a>
      </Popconfirm>
    );
  }
}

export default Basic;

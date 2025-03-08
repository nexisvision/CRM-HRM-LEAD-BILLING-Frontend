import React, { Component } from "react";
import { message, Button } from "antd";

const success = () => {
  const hide = message.loading("Action in progress..", 0);
  setTimeout(hide, 2500);
};

export class Loading extends Component {
  render() {
    return <Button onClick={success}>Display a loading indicator</Button>;
  }
}

export default Loading;

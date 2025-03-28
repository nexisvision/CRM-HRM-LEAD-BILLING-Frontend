import React, { Component } from "react";
import { Popconfirm, Switch, message } from "antd";

export class DynamicTrigger extends Component {
  state = {
    visible: false,
    condition: true // Whether meet the condition, if not show popconfirm.
  };

  changeCondition = value => {
    this.setState({ condition: value });
  };

  confirm = () => {
    this.setState({ visible: false });
    message.success("Next step.");
  };

  cancel = () => {
    this.setState({ visible: false });
    message.error("Click on cancel.");
  };

  handleVisibleChange = visible => {
    if (!visible) {
      this.setState({ visible });
      return;
    }
    if (this.state.condition) {
      this.confirm(); 
    } else {
      this.setState({ visible });
    }
  };

  render() {
    return (
      <div>
        <Popconfirm
          title="Are you sure delete this task?"
          open={this.state.visible}
          onOpenChange={this.handleVisibleChange}
          onConfirm={this.confirm}
          onCancel={this.cancel}
          okText="Yes"
          cancelText="No"
        >
          <a href="/#">Delete a task</a>
        </Popconfirm>
        <br />
        <br />
        Whether directly execute：
        <Switch defaultChecked onChange={this.changeCondition} />
      </div>
    );
  }
}

export default DynamicTrigger;

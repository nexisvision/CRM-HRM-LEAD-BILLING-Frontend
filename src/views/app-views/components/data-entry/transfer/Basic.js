import React, { Component } from "react";
import { Transfer, Switch } from "antd";

const mockData = [];
for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 3 < 1
  });
}

const oriTargetKeys = mockData
  .filter(item => +item.key % 3 > 1)
  .map(item => item.key);

export class Basic extends Component {
  state = {
    targetKeys: oriTargetKeys,
    selectedKeys: [],
    disabled: false
  };

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({
      selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]
    });

  };

  handleScroll = (direction, e) => {
  };

  handleDisable = disabled => {
    this.setState({ disabled });
  };

  render() {
    const { targetKeys, selectedKeys, disabled } = this.state;
    return (
      <div>
        <Transfer
          dataSource={mockData}
          titles={["Source", "Target"]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={this.handleChange}
          onSelectChange={this.handleSelectChange}
          onScroll={this.handleScroll}
          render={item => item.title}
          disabled={disabled}
        />
        <Switch
          unCheckedChildren="disabled"
          checkedChildren="disabled"
          checked={disabled}
          onChange={this.handleDisable}
          style={{ marginTop: 16 }}
        />
      </div>
    );
  }
}

export default Basic;

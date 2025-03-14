import React, { Component } from "react";
import { SettingOutlined } from '@ant-design/icons';
import { Collapse, Select } from "antd";

const { Panel } = Collapse;
const { Option } = Select;

function callback(key) {
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const genExtra = () => (
  <SettingOutlined
    onClick={event => {
      event.stopPropagation();
    }}
  />
);

export class Extra extends Component {
  state = {
    expandIconPosition: "start"
  };

  onPositionChange = expandIconPosition => {
    this.setState({ expandIconPosition });
  };

  render() {
    const { expandIconPosition } = this.state;
    return (
      <div>
        <Collapse
          defaultActiveKey={["1"]}
          onChange={callback}
          expandIconPosition={expandIconPosition}
        >
          <Panel header="This is panel header 1" key="1" extra={genExtra()}>
            <div>{text}</div>
          </Panel>
          <Panel header="This is panel header 2" key="2" extra={genExtra()}>
            <div>{text}</div>
          </Panel>
          <Panel header="This is panel header 3" key="3" extra={genExtra()}>
            <div>{text}</div>
          </Panel>
        </Collapse>
        <br />
        <span>Expand Icon Position: </span>
        <Select value={expandIconPosition} onChange={this.onPositionChange}>
          <Option value="start">start</Option>
          <Option value="end">end</Option>
        </Select>
      </div>
    );
  }
}

export default Extra;

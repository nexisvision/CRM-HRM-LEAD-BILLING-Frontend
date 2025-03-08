---
order: 3
title:
  zh-CN: 条件触发
  en-US: Conditional trigger
---

## zh-CN

可以判断是否需要弹出。

## en-US

Make it pop up under some conditions.

```jsx
import { Popconfirm, Switch, message } from 'antd';

class App extends React.Component {
  state = {
    visible: false,
    condition: true, // Whether meet the condition, if not show popconfirm.
  };

  changeCondition = value => {
    this.setState({ condition: value });
  };

  confirm = () => {
    this.setState({ visible: false });
    message.success('Next step.');
  };

  cancel = () => {
    this.setState({ visible: false });
    message.error('Click on cancel.');
  };

  handleVisibleChange = visible => {
    if (!visible) {
      this.setState({ visible });
      return;
    }
    console.log(this.state.condition);
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
          <a href="#">Delete a task</a>
        </Popconfirm>
        <br />
        <br />
        Whether directly execute：
        <Switch defaultChecked onChange={this.changeCondition} />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
```

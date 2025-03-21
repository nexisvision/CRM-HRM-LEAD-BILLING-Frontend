import React, { Component } from "react";
import { DatePicker } from "antd";

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

function onChange(date, dateString) {
}

export class Basic extends Component {
  render() {
    return (
      <div>
        <DatePicker onChange={onChange} />
        <br />
        <MonthPicker onChange={onChange} placeholder="Select month" />
        <br />
        <RangePicker onChange={onChange} />
        <br />
        <WeekPicker onChange={onChange} placeholder="Select week" />
      </div>
    );
  }
}

export default Basic;

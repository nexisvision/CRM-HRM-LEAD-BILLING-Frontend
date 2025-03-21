import React, { Component } from "react";
import dayjs from "dayjs";
import { DatePicker } from "antd";

const { MonthPicker, RangePicker } = DatePicker;

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function disabledDate(current) {
  return current && current < dayjs().endOf("day");
}

function disabledDateTime() {
  return {
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56]
  };
}

function disabledRangeTime(_, type) {
  if (type === "start") {
    return {
      disabledHours: () => range(0, 60).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56]
    };
  }
  return {
    disabledHours: () => range(0, 60).splice(20, 4),
    disabledMinutes: () => range(0, 31),
    disabledSeconds: () => [55, 56]
  };
}

export class DisabledDate extends Component {
  render() {
    return (
      <div>
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          disabledDate={disabledDate}
          disabledTime={disabledDateTime}
          showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
        />
        <br />
        <MonthPicker disabledDate={disabledDate} placeholder="Select month" />
        <br />
        <RangePicker
          disabledDate={disabledDate}
          disabledTime={disabledRangeTime}
          showTime={{
            hideDisabledOptions: true,
            defaultValue: [
              dayjs("00:00:00", "HH:mm:ss"),
              dayjs("11:59:59", "HH:mm:ss")
            ]
          }}
          format="YYYY-MM-DD HH:mm:ss"
        />
      </div>
    );
  }
}

export default DisabledDate;

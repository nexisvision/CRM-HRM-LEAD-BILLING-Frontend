import React, { Component } from "react";
import { Anchor } from "antd";

const { Link } = Anchor;

const onChange = link => {
};

export class OnChange extends Component {
  render() {
    return (
      <Anchor affix={false} onChange={onChange}>
        <Link href="#components-anchor-demo-basic" title="Basic demo" />
        <Link href="#components-anchor-demo-static" title="Static demo" />
        <Link href="#API" title="API">
          <Link href="#Anchor-Props" title="Anchor Props" />
          <Link href="#Link-Props" title="Link Props" />
        </Link>
      </Anchor>
    );
  }
}

export default OnChange;

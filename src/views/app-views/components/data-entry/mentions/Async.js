import React, { Component } from "react";
import { Mentions } from "antd";
import debounce from "lodash/debounce";

const { Option } = Mentions;

class AsyncMention extends React.Component {
  constructor() {
    super();

    this.loadGithubUsers = debounce(this.loadGithubUsers, 800);
  }

  state = {
    search: "",
    loading: false,
    users: []
  };

  onSearch = search => {
    this.setState({ search, loading: !!search, users: [] });
    this.loadGithubUsers(search);
  };

  loadGithubUsers(key) {
    if (!key) {
      this.setState({
        users: []
      });
      return;
    }

    fetch(`https://api.github.com/search/users?q=${key}`)
      .then(res => res.json())
      .then(({ items = [] }) => {
        const { search } = this.state;
        if (search !== key) return;

        this.setState({
          users: items.slice(0, 10),
          loading: false
        });
      });
  }

  render() {
    const { users, loading } = this.state;

    return (
      <Mentions
        style={{ width: "100%" }}
        loading={loading}
        onSearch={this.onSearch}
      >
        {users.map(({ login, avatar_url: avatar }) => (
          <Option
            key={login}
            value={login}
            className="antd-demo-dynamic-option"
          >
            <img src={avatar} alt={login} />
            <span>{login}</span>
          </Option>
        ))}
      </Mentions>
    );
  }
}

export class Async extends Component {
  render() {
    return <AsyncMention />;
  }
}

export default Async;

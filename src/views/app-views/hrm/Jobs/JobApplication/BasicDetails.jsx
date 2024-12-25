import React, { Component } from 'react';
import { Card, Button, Radio, Avatar } from 'antd';

class BasicDetails extends Component {
  state = {
    user: {
      name: 'Candice',
      email: 'Candice@gmail.com',
      image: 'https://via.placeholder.com/100', // Replace with the user's image URL
    },
    status: 'Phone Screen', // Default status
  };

  handleStatusChange = (e) => {
    this.setState({ status: e.target.value });
  };

  render() {
    const { user, status } = this.state;

    return (
      <Card title="Basic Details" extra={<Button type="primary">UnArchive</Button>} style={{ width: 400 , height:500 }}>
            <hr style={{ marginBottom: '10px', border: '1px solid #e8e8e8' }} />

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Avatar size={64} src={user.image} />
          <div style={{ marginLeft: 16 }}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </div>

        <Radio.Group onChange={this.handleStatusChange} value={status}>
          <Radio value="Applied">Applied</Radio>
          <Radio value="Phone Screen">Phone Screen</Radio>
          <Radio value="Interview">Interview</Radio>
          <Radio value="Hired">Hired</Radio>
          <Radio value="Rejected">Rejected</Radio>
        </Radio.Group>
      </Card>
    );
  }
}

export default BasicDetails;

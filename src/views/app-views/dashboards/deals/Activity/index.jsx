import React from 'react';
import { List, Card } from 'antd';

const activities = [
  {
    type: 'Create Deal Call',
    description: 'Workdo Create new Deal Call',
    time: '0 seconds ago',
    icon: 'phone',
    iconColor: '#39d039',
  },
  {
    type: 'Create Task',
    description: 'Workdo Create new Deal Call',
    time: '3 years ago',
    icon: 'task',
    iconColor: '#39d039',
  },
];

const Activity = () => {
  return (
    <Card>
      <h1 className='mb-3 text-lg font-bold'>Activity</h1>


      <List
        itemLayout="horizontal"
        dataSource={activities}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: item.iconColor,
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}
                  >
                    {item.icon === 'phone' ? '📞' : '➕'}
                  </span>
                </div>
              }
              title={<strong>{item.type}</strong>}
              description={
                <div>
                  <p style={{ marginBottom: '5px' }}>{item.description}</p>
                  <span style={{ color: '#999' }}>{item.time}</span>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Activity;

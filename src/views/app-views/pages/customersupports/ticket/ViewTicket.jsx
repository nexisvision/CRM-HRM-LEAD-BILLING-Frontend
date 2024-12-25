import React, { useState } from 'react';
import { Card, Row, Col, Tag, Input, Button, Avatar, List, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const ViewTicket = () => {
  const [comments, setComments] = useState([
    {
      author: 'Mick Aston',
      avatar: 'https://i.pravatar.cc/300',
      content: 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print.',
      datetime: '3 years ago',
    },
    {
      author: 'Workdo',
      avatar: 'https://i.pravatar.cc/300?img=10',
      content: 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print.',
      datetime: '3 years ago',
    },
    {
      author: 'Workdo',
      avatar: 'https://i.pravatar.cc/300?img=10',
      content: 'fdgdfg',
      datetime: '1 second ago',
    },
  ]);

  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newEntry = {
        author: 'You',
        avatar: 'https://i.pravatar.cc/300?img=20',
        content: newComment,
        datetime: 'Just now',
      };
      setComments([newEntry, ...comments]);
      setNewComment('');
    }
  };

  return (
    
    <Card>
      <Typography.Title level={5}>
        Reply Ticket - <span style={{ color: 'green' }}>030823</span>
      </Typography.Title>
      <Row gutter={16}>
        {/* Left Column */}
        <Col span={16}>
          <Card>
            <Tag color="cyan">Medium</Tag>
            <Typography.Title level={5}>Product Installation Related</Typography.Title>
            <Typography.Text>Workdo • company@example.com • Aug 7, 2021</Typography.Text>
            <Typography.Paragraph style={{ marginTop: '10px' }}>
              Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print.
            </Typography.Paragraph>
          </Card>
          <Card style={{ marginTop: '20px' }}>
            <Typography.Title level={5}>Add a Comment</Typography.Title>
            <Input.TextArea
              rows={3}
              placeholder="Your comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ marginBottom: '10px' }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleAddComment}
              block
            >
              Send
            </Button>
          </Card>
        </Col>

        {/* Right Column (Comments List) */}
        <Col span={8}>
          <Card>
            <Typography.Title level={5}>Comments</Typography.Title>
            <List
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<Typography.Text strong>{item.author}</Typography.Text>}
                    description={
                      <>
                        <Typography.Text>{item.content}</Typography.Text>
                        <br />
                        <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                          {item.datetime}
                        </Typography.Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default ViewTicket;











// import React, { useState } from 'react';
// import { Card, Row, Col, Tag, Input, Button, Avatar, List, Typography } from 'antd';
// import { SendOutlined } from '@ant-design/icons';

// const ViewTicket = () => {
//   const [comments, setComments] = useState([
//     {
//       author: 'Mick Aston',
//       avatar: 'https://i.pravatar.cc/300',
//       content: 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print.',
//       datetime: '3 years ago',
//     },
//     {
//       author: 'Workdo',
//       avatar: 'https://i.pravatar.cc/300?img=10',
//       content: 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print.',
//       datetime: '3 years ago',
//     },
//     {
//       author: 'Workdo',
//       avatar: 'https://i.pravatar.cc/300?img=10',
//       content: 'fdgdfg',
//       datetime: '1 second ago',
//     },
//   ]);

//   const [newComment, setNewComment] = useState('');

//   const handleAddComment = () => {
//     if (newComment.trim()) {
//       const newEntry = {
//         author: 'You',
//         avatar: 'https://i.pravatar.cc/300?img=20',
//         content: newComment,
//         datetime: 'Just now',
//       };
//       setComments([newEntry, ...comments]);
//       setNewComment('');
//     }
//   };

//   return (
//     <Card>
//       <Typography.Title level={5}>
//         Reply Ticket - <span style={{ color: 'green' }}>030823</span>
//       </Typography.Title>
//       <Row gutter={16}>
//         <Col span={16}>
//           <Card>
//             <Tag color="cyan">Medium</Tag>
//             <Typography.Title level={5}>Product Installation Related</Typography.Title>
//             <Typography.Text>Workdo • company@example.com • Aug 7, 2021</Typography.Text>
//             <Typography.Paragraph style={{ marginTop: '10px' }}>
//               Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print.
//             </Typography.Paragraph>
//           </Card>
//           <Card style={{ marginTop: '20px' }}>
//             <Typography.Title level={5}>Comments</Typography.Title>
//             <Input.TextArea
//               rows={3}
//               placeholder="Your comment"
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               style={{ marginBottom: '10px' }}
//             />
//             <Button
//               type="primary"
//               icon={<SendOutlined />}
//               onClick={handleAddComment}
//               block
//             >
//               Send
//             </Button>
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card>
//             <List
//               itemLayout="horizontal"
//               dataSource={comments}
//               renderItem={(item) => (
//                 <Input
//                   author={item.author}
//                   avatar={<Avatar src={item.avatar} />}
//                   content={<Typography.Text>{item.content}</Typography.Text>}
//                   datetime={<Typography.Text type="secondary">{item.datetime}</Typography.Text>}
//                 />
//               )}
//             />
//           </Card>
//         </Col>
//       </Row>
//     </Card>
//   );
// };

// export default ViewTicket;

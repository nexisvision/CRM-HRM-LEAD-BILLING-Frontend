import React, { useState } from "react";
import { Input, List, Button, Avatar, Typography, Space, Col,Card } from "antd";
import { DeleteOutlined, SendOutlined } from "@ant-design/icons";

const { Text } = Typography;

const initialComments = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/50?img=1",
    text: "Ab et non qui est im",
    time: "2 years ago",
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/50?img=2",
    text: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born",
    time: "2 years ago",
  },
];

const Comment = () => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    const newCommentObj = {
      id: comments.length + 1,
      avatar: "https://i.pravatar.cc/50?img=3", // Example avatar, can be dynamic
      text: newComment,
      time: "Just now",
    };
    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  const handleDeleteComment = (id) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  return (
    <div>
      <Col span={24}>
          <Card className="bg-white">
          <div className="font-semibold text-lg mb-2">Contract Comment</div>
      {/* Input Box */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <Input
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onPressEnter={handleAddComment}
          style={{
            flex: 1,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleAddComment}
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        />
      </div>

      {/* Comments List */}
      <List
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item
            actions={[
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteComment(comment.id)}
              />,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={comment.avatar} />}
              title={
                <Space direction="vertical" size={0}>
                  <Text>{comment.text}</Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {comment.time}
                  </Text>
                </Space>
              }
            />
          </List.Item>
        )}
      />
      </Card>
      </Col>
    </div>
  );
};

export default Comment;

import React, { useState } from 'react';
import { Card, Button, Input, Tag, Row, Col, Space, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const AdditionalDetails = () => {
  const [skills, setSkills] = useState(['Marketing', 'Sales']);
  const [newSkill, setNewSkill] = useState('');
  const [notes, setNotes] = useState('');
  
  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (removedSkill) => {
    setSkills(skills.filter(skill => skill !== removedSkill));
  };

  const handleNoteChange = (e) => {
    setNotes(e.target.value);
  };

  return (
    <Card
      title="Additional Details"
      extra={
        <Button type="primary" style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}>
          + Create Interview Schedule
        </Button>
      }
      style={{ maxWidth: 1100, margin: '0 auto' }}
    >
            <hr style={{ marginBottom: '10px', border: '1px solid #e8e8e8' }} />

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <strong>What Do You Consider to Be Your Weaknesses?</strong>
          <p>Candice Candice Candice Candice Candice</p>
        </div>
        <div>
          <strong>Why Do You Want This Job?</strong>
          <p>Candice Candice Candice</p>
        </div>
        <div>
          <strong>Why Do You Want to Work at This Company?</strong>
          <p>Candice Candice Candice</p>
        </div>

        <div>
          <strong>Skills</strong>
          <Row gutter={[8, 8]}>
            {skills.map(skill => (
              <Tag key={skill} closable onClose={() => removeSkill(skill)}>
                {skill}
              </Tag>
            ))}
          </Row>
          <Space>
            <Input
              placeholder="Add Skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onPressEnter={addSkill}
            />
            <Button type="primary" onClick={addSkill}>
              Add Skills
            </Button>
          </Space>
        </div>

        <div>
          <strong>Applicant Notes</strong>
          <Input.TextArea
            placeholder="Type here..."
            rows={4}
            value={notes}
            onChange={handleNoteChange}
          />
          <Button type="primary" style={{ marginTop: 8 }} onClick={() => console.log('Notes Added:', notes)}>
            Add Notes
          </Button>
        </div>

        <Row justify="space-between" align="middle">
          <Col>
            <strong>Workdo</strong>
            <p>Test</p>
          </Col>
          <Col>
            <Tooltip title="Delete this entry">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
            <p style={{ marginTop: 4, color: 'purple' }}>24-05-2022</p>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

export default AdditionalDetails;

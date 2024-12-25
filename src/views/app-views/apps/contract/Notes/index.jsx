import React, { useState } from "react";
import { Input, Button, Typography, Space, Avatar,Col,Card, message } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Text } = Typography;

const initialNotes = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/50?img=1", // Placeholder avatar
    note: `"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings"`,
    time: "2 years ago",
  },
];

const Notes = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (newNote.trim() === "") {
      message.warning("Please enter a note before adding.");
      return;
    }

    const newNoteObj = {
      id: notes.length + 1,
      avatar: "https://i.pravatar.cc/50?img=2", // Dynamic avatar
      note: newNote,
      time: "Just now",
    };

    setNotes([newNoteObj, ...notes]);
    setNewNote("");
  };

  const handleGrammarCheck = () => {
    message.info("Grammar check functionality coming soon!");
  };

  return (
    <div>
         <Col span={24}>
          <Card className="bg-white">
          <div className="font-semibold text-lg mb-2">Contract Notes</div>


    
      {/* Note Input */}
      <div style={{ display: "flex", marginBottom: 20 }}>
        <TextArea
          placeholder="Add a Note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={3}
          style={{
            flex: 1,
            marginRight: 10,
          }}
        />
        <Button
          type="primary"
        //   style={{
           
        //     borderColor: "#40c057",
        //     height: "auto",
        //   }}
          onClick={handleAddNote}
        >
          Add
        </Button>
      </div>

      {/* Notes List */}
      <div>
        {notes.map((note) => (
          <div
            key={note.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: 20,
              padding: 10,
              border: "1px solid #f0f0f0",
              borderRadius: 8,
            }}
          >
            <Avatar src={note.avatar} style={{ marginRight: 10 }} />
            <div>
              <Text style={{ fontStyle: "italic", display: "block" }}>
                {note.note}
              </Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {note.time}
              </Text>
            </div>
          </div>
        ))}
      </div>
      </Card>
      </Col>
    </div>
  );
};

export default Notes;

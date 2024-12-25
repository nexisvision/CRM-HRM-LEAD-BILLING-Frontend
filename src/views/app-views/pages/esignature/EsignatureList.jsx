import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { UndoOutlined, RedoOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Input, Table, Modal, notification, Popconfirm, Button } from 'antd';

const ESignaturePage = () => {
  const sigPadRef = useRef(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [savedSignatures, setSavedSignatures] = useState([]);
  const [tempSignature, setTempSignature] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSignature, setEditingSignature] = useState(null);

  // Handle start drawing
  const handleBeginStroke = () => {
    setIsDrawing(true);
    setHasDrawing(true);
  };

  // Handle end drawing and save to history
  const handleEndStroke = () => {
    if (isDrawing) {
      const currentData = sigPadRef.current.toData();
      if (currentData && currentData.length > 0) {
        // Save only the last stroke to undo stack
        const lastStroke = currentData[currentData.length - 1];
        setUndoStack(prev => [...prev, lastStroke]);
        // Clear redo stack when new stroke is added
        setRedoStack([]);
      }
      setIsDrawing(false);
    }
  };

  const columns = [
    {
      title: 'Sr No.',
      dataIndex: 'key',
      key: 'key',
      width: '80px',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Signature',
      dataIndex: 'signature',
      key: 'signature',
      render: (signature) => (
        <img src={signature} alt="Signature" className="h-16" />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '200px',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            className="flex items-center bg-blue-500"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Signature"
            description="Are you sure you want to delete this signature?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ className: 'bg-blue-500' }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              className="flex items-center"
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Undo last stroke
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const currentData = sigPadRef.current.toData();
      if (currentData && currentData.length > 0) {
        // Remove the last stroke
        const lastStroke = currentData[currentData.length - 1];
        const newData = currentData.slice(0, -1);
        
        // Update the canvas
        sigPadRef.current.clear();
        if (newData.length > 0) {
          sigPadRef.current.fromData(newData);
        }

        // Update undo/redo stacks
        setRedoStack(prev => [...prev, lastStroke]);
        setUndoStack(prev => prev.slice(0, -1));

        // Update hasDrawing state
        if (newData.length === 0) {
          setHasDrawing(false);
        }
      }
    }
  };

  // Redo last undone stroke
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const currentData = sigPadRef.current.toData() || [];
      const strokeToRedo = redoStack[redoStack.length - 1];
      
      // Add the stroke back
      const newData = [...currentData, strokeToRedo];
      sigPadRef.current.fromData(newData);

      // Update undo/redo stacks
      setUndoStack(prev => [...prev, strokeToRedo]);
      setRedoStack(prev => prev.slice(0, -1));
      setHasDrawing(true);
    }
  };

  // Handle edit signature
  const handleEdit = (record) => {
    setEditingSignature(record);
    setSignatureName(record.name);
    setIsEditMode(true);
    
    // Clear existing stacks
    setUndoStack([]);
    setRedoStack([]);
    
    // Load the signature into the canvas for editing
    if (sigPadRef.current) {
      sigPadRef.current.clear();
      const img = new Image();
      img.src = record.signature;
      img.onload = () => {
        const canvas = sigPadRef.current._canvas;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        setHasDrawing(true);
      };
    }
  };

  // Clear the signature pad
  const clearSignature = () => {
    sigPadRef.current.clear();
    setUndoStack([]);
    setRedoStack([]);
    setHasDrawing(false);
  };

  const handleSave = () => {
    if (sigPadRef.current.isEmpty()) {
      notification.error({
        message: 'Error',
        description: 'Please draw your signature first.',
      });
      return;
    }

    const dataURL = sigPadRef.current.getTrimmedCanvas().toDataURL("image/png");
    setTempSignature(dataURL);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    if (!signatureName.trim()) {
      notification.error({
        message: 'Error',
        description: 'Please enter a signature name.',
      });
      return;
    }

    if (isEditMode && editingSignature) {
      // Update existing signature
      setSavedSignatures(prev =>
        prev.map(sig =>
          sig.key === editingSignature.key
            ? { ...sig, name: signatureName, signature: tempSignature }
            : sig
        )
      );
      notification.success({
        message: 'Success',
        description: 'Signature updated successfully!',
      });
    } else {
      // Add new signature
      const newSignature = {
        key: savedSignatures.length + 1,
        name: signatureName,
        signature: tempSignature
      };
      setSavedSignatures(prev => [...prev, newSignature]);
      notification.success({
        message: 'Success',
        description: 'Signature saved successfully!',
      });
    }

    // Reset states
    clearSignature();
    setSignatureName("");
    setIsModalVisible(false);
    setIsEditMode(false);
    setEditingSignature(null);
  };

  // Handle delete signature
  const handleDelete = (key) => {
    setSavedSignatures(prev => {
      const updatedSignatures = prev.filter(sig => sig.key !== key);
      // Reorder the keys after deletion
      return updatedSignatures.map((sig, index) => ({
        ...sig,
        key: index + 1
      }));
    });
    
    notification.success({
      message: 'Success',
      description: 'Signature deleted successfully!',
    });
  };

  // Modified save button text based on mode
  const getSaveButtonText = () => {
    if (isEditMode) {
      return 'Update';
    }
    return 'Save';
  };

  return (
    <div className="p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? 'Edit Signature' : 'Draw Signature'}
        </h2>
        <div className="relative">
          <SignatureCanvas
            ref={sigPadRef}
            canvasProps={{
              className: "border-2 border-dashed border-gray-300 w-full h-64 rounded-md",
              style: {
                cursor: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'%3E%3Cpath d='M8 24l12-12 4 4-12 12-5 1 1-5z' fill='%23000000' stroke='%23ffffff'/%3E%3C/svg%3E") 0 32, auto`
              }
            }}
            onBegin={handleBeginStroke}
            onEnd={handleEndStroke}
          />
          {!hasDrawing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-gray-400">
                {isEditMode ? 'Edit signature here' : 'Sign here'}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-center space-x-4">
          {hasDrawing && (
            <>
              {undoStack.length > 0 && (
                <Button
                  icon={<UndoOutlined />}
                  onClick={handleUndo}
                  className="flex items-center"
                >
                  Undo
                </Button>
              )}
              {redoStack.length > 0 && (
                <Button
                  icon={<RedoOutlined />}
                  onClick={handleRedo}
                  className="flex items-center"
                >
                  Redo
                </Button>
              )}
            </>
          )}
          <Button danger onClick={clearSignature}>
            Clear
          </Button>
          <Button 
            type="primary" 
            onClick={handleSave}
            className="bg-blue-500"
          >
            {isEditMode ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Saved Signatures Table */}
      {savedSignatures.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          <h2 className="text-xl font-semibold mb-4">Saved Signatures</h2>
          <Table 
            columns={columns} 
            dataSource={savedSignatures}
            pagination={false}
            className="border rounded-lg"
          />
        </div>
      )}

      {/* Save/Edit Modal */}
      <Modal
        title={isEditMode ? "Edit Signature" : "Save Signature"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          setSignatureName("");
          setIsEditMode(false);
          setEditingSignature(null);
        }}
        okText={isEditMode ? "Update" : "Save"}
      >
        <Input
          placeholder="Enter signature name"
          value={signatureName}
          onChange={(e) => setSignatureName(e.target.value)}
          className="mb-4"
        />
        {tempSignature && (
          <div className="border p-4 rounded">
            <img src={tempSignature} alt="Preview" className="h-32 mx-auto" />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ESignaturePage;

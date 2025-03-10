import React, { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { UndoOutlined, RedoOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Input, Table, Modal, notification, Popconfirm, Button } from 'antd';
import { addesig, deletesigssss, getsignaturesss } from "./EsignatureReducers/EsignatureSlice";
import { useDispatch, useSelector } from "react-redux";

const ESignaturePage = () => {
  const sigPadRef = useRef(null);
  const dispatch = useDispatch()
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

  const handleBeginStroke = () => {
    setIsDrawing(true);
    setHasDrawing(true);
  };

  const handleEndStroke = () => {
    if (isDrawing) {
      const currentData = sigPadRef.current.toData();
      if (currentData && currentData.length > 0) {
        const lastStroke = currentData[currentData.length - 1];
        setUndoStack(prev => [...prev, lastStroke]);
        setRedoStack([]);
      }
      setIsDrawing(false);
    }
  };

  useEffect(()=>{
    dispatch(getsignaturesss())
  },[dispatch])

  const alldatass = useSelector((state)=>state.esignature.esignature.data)

  useEffect(() => {
    if (alldatass) {
      const formattedData = alldatass.map((item, index) => ({
        key: index + 1,
        id: item.id,
        name: item.esignature_name,
        signature: item.e_signatures,
        created_at: item.createdAt,
        created_by: item.created_by
      }));
      setSavedSignatures(formattedData);
    }
  }, [alldatass]);

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
      title: 'Created By',
      dataIndex: 'created_by',
      key: 'created_by',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '200px',
      render: (_, record) => (
        <div className="flex gap-2">
         
          <Popconfirm
            title="Delete Signature"
            description="Are you sure you want to delete this signature?"
            onConfirm={() => handleDelete(record)}
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

  const saveSignature = async (name, signatureFile) => {
    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('signature', signatureFile); // This should be a File/Blob object

        const response = await fetch('/api/signature/save', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error saving signature:', error);
        throw error;
    }
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
    // dispatch(addesig(dataURL))
  };

  const handleModalOk = async () => {
    if (!signatureName.trim() || !tempSignature) {
      notification.error({
        message: 'Error',
        description: 'Please provide both signature name and draw a signature.',
      });
      return;
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Convert base64 to blob
      const base64Data = tempSignature.split(',')[1];
      const binaryData = atob(base64Data);
      const array = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        array[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([array], { type: 'image/png' });
      
      // Create file object from blob
      const file = new File([blob], `${signatureName.trim()}.png`, { type: 'image/png' });

      // Create FormData and append all values
      const formData = new FormData();
      formData.append('esignature_name', signatureName.trim());
      formData.append('e_signatures', file);

      // Make API call with authorization header
      const saveResponse = await fetch('/api/v1/esignatures', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
       
        },
        body: formData,
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save signature');
      }

      const savedData = await saveResponse.json();

      dispatch(getsignaturesss())

      // Add the new signature to the table
      setSavedSignatures(prev => [
        ...prev,
        {
          key: prev.length + 1,
          name: signatureName.trim(),
          signature: savedData.fileUrl,
        }
      ]);

      // Reset states
      clearSignature();
      setSignatureName("");
      setIsModalVisible(false);
      setIsEditMode(false);
      setEditingSignature(null);

      // notification.success({
      //   message: 'Success',
      //   description: 'Signature saved successfully!',
      // });

    } catch (error) {
      console.error('Error saving signature:', error);
      // notification.error({
      //   message: 'Error',
      //   description: error.message || 'Failed to save signature.',
      // });
    }
  };

  // Handle delete signature
  const handleDelete = (record) => {
    dispatch(deletesigssss(record.id))
    dispatch(getsignaturesss())
    setSavedSignatures(prev => {
      const updatedSignatures = prev.filter(sig => sig.key !== record.key);
      return updatedSignatures.map((sig, index) => ({
        ...sig,
        key: index + 1
      }));

     
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
        <div className="border-b border-gray-200 my-3"></div>
        <label htmlFor="" className="text-sm font-semibold mb-2">Enter Signature Name</label>
        <Input
          placeholder="Enter signature name"
          value={signatureName}
          onChange={(e) => setSignatureName(e.target.value)}
          className="my-2"
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

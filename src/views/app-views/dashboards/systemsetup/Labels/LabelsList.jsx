import React, { useState } from 'react';
import { TiArrowMove } from "react-icons/ti";
import Flex from 'components/shared-components/Flex'
import { Button, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddLabels from './AddLabels';
import EditLabels from './EditLabels';
// import { DragHandle } from '@mui/icons-material';

const LabelsList = () => {
  const [selectedTab, setSelectedTab] = useState('sales');
  const [isEditLabelsModalVisible, setIsEditLabelsModalVisible] = useState(false);
  const [isAddLabelsModalVisible, setIsAddLabelsModalVisible] = useState(false);

  // Open Add Job Modal
  const openAddLabelsModal = () => {
    setIsAddLabelsModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddLabelsModal = () => {
    setIsAddLabelsModalVisible(false);
  };

  // Open Add Job Modal
  const openEditLabelsModal = () => {
    setIsEditLabelsModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditLabelsModal = () => {
      setIsEditLabelsModalVisible(false);
  };


  // Sample data for Sales and Marketing
  const salesData = [
    { id: 1, name: 'On Hold', order: 1 },
    { id: 2, name: 'New', order: 2 },
    { id: 3, name: 'Pending', order: 3 },
    { id: 4, name: 'Loss', order: 4 },
    { id: 5, name: 'Win', order: 5 },
  ];

  const marketingData = [
    { id: 1, name: 'Pending', order: 1 },
    { id: 2, name: 'On Hold', order: 2 },
  ];

  return (
    <>

    <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center'>
              <h1 className='text-lg font-bold'>Manage Labels</h1>
        </div>
        <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap mt-2 gap-4'>
          <div className='flex justify-end'>
            <Button type="primary"  onClick={openAddLabelsModal}>
              <PlusOutlined />
            </Button>
          </div>
        </Flex>
      </div>
    <div className="flex min-h-screen bg-gray-100">

      {/* Main Content */}
      <div className="flex-1">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6 ">
          <button
            onClick={() => setSelectedTab('sales')}
            className={`w-full py-2 px-4 rounded-md transition-colors duration-200
              ${
                selectedTab === 'sales'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            Sales
          </button>
          <button
            onClick={() => setSelectedTab('marketing')}
            className={`w-full py-2 px-4 rounded-md transition-colors duration-200
              ${
                selectedTab === 'marketing'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            Marketing
          </button>
        </div>

        {/* List Items */}
        <div className="bg-white rounded-lg shadow ">
          {(selectedTab === 'sales' ? salesData : marketingData).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-6 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 border"
            >
              <div className="flex items-center space-x-4">
                    <TiArrowMove className="text-black text-4xl font-medium cursor-move"/>
                {/* <DragHandle className="text-gray-400 cursor-move" /> */}
                <span className="text-black text-lg font-normal">{item.name}</span>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-teal-500 hover:bg-teal-50 rounded-md transition-colors duration-200">
                  <EditOutlined className=' text-xl' onClick={openEditLabelsModal}/>
                </button>
                <button className="p-2 text-pink-500 hover:bg-pink-50 rounded-md transition-colors duration-200">
                  <DeleteOutlined className='text-xl'/>
                </button>
              </div>
            </div>
          ))}
                  {/* Note */}
                  <div className=" font-medium text-sm p-3">
                      Note: You can easily change order of lead stage using drag & drop.
                  </div>
        </div>

      </div>
    </div>
    <Modal
            title="Add Labels"
            visible={isAddLabelsModalVisible}
            onCancel={closeAddLabelsModal}
            footer={null}
            width={700}
            className='mt-[-70px]'
          >
            <AddLabels onClose={closeAddLabelsModal} />
          </Modal>

          <Modal
            title="Edit Labels"
              visible={isEditLabelsModalVisible}
            onCancel={closeEditLabelsModal}
            footer={null}
            width={700}
            className='mt-[-70px]'
          >
              <EditLabels onClose={closeEditLabelsModal} />
          </Modal>
    </>
  );
};

export default LabelsList;      
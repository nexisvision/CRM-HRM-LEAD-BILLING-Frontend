import React, { useState } from 'react';
import { TiArrowMove } from "react-icons/ti";
import AddDealStages from './AddDealStages';
import EditDealStages from './EditDealStages';
import Flex from 'components/shared-components/Flex'
import { Button, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import { DragHandle } from '@mui/icons-material';

const DealStagesList = () => {
  const [selectedTab, setSelectedTab] = useState('sales');

  const [isEditDealStagesModalVisible, setIsEditDealStagesModalVisible] = useState(false);
  const [isAddDealStagesModalVisible, setIsAddDealStagesModalVisible] = useState(false);

  // Open Add Job Modal
  const openAddDealStagesModal = () => {
    setIsAddDealStagesModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddDealStagesModal = () => {
    setIsAddDealStagesModalVisible(false);
  };

  // Open Add Job Modal
  const openEditDealStagesModal = () => {
    setIsEditDealStagesModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditDealStagesModal = () => {
    setIsEditDealStagesModalVisible(false);
  };


  // Sample data for Sales and Marketing
  const salesData = [
    { id: 1, name: 'Initial Contact', order: 1 },
    { id: 2, name: 'Meeting', order: 2 },
    { id: 3, name: 'Qualification', order: 3 },
    { id: 4, name: 'Proposal', order: 4 },
    { id: 5, name: 'Close', order: 5 },
  ];

  const marketingData = [
    { id: 1, name: 'Initial Contact', order: 1 },
    { id: 2, name: 'Qualification', order: 2 },
    { id: 3, name: 'Meeting', order: 3 },
    { id: 4, name: 'Close', order: 4 },
  ];

  return (

    <>

      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center'>
          <h1 className='text-lg font-bold'>Manage Deal Stages</h1>
        </div>
        <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap mt-2 gap-4'>
          <div className='flex justify-end'>
            <Button type="primary" onClick={openAddDealStagesModal}>
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
              ${selectedTab === 'sales'
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
              ${selectedTab === 'marketing'
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
                  <TiArrowMove className="text-black text-4xl font-medium cursor-move" />
                  {/* <DragHandle className="text-gray-400 cursor-move" /> */}
                  <span className="text-black text-lg font-normal">{item.name}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-teal-500 hover:bg-teal-50 rounded-md transition-colors duration-200" onClick={openEditDealStagesModal}>
                    <EditOutlined className=' text-xl' />
                  </button>
                  <button className="p-2 text-pink-500 hover:bg-pink-50 rounded-md transition-colors duration-200">
                    <DeleteOutlined className='text-xl' />
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
        title="Add Lead Stages"
        visible={isAddDealStagesModalVisible}
        onCancel={closeAddDealStagesModal}
        footer={null} 
        width={700}
        className='mt-[-70px]'
      >
        <AddDealStages onClose={closeAddDealStagesModal} />
      </Modal>

      <Modal
        title="Edit Lead Stages"
        visible={isEditDealStagesModalVisible}
        onCancel={closeEditDealStagesModal}
        footer={null}
        width={700}
        className='mt-[-70px]'
      >
        <EditDealStages onClose={closeEditDealStagesModal} />
      </Modal>
    </>
  );
};

export default DealStagesList;
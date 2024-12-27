import React, { useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { TiArrowMove } from "react-icons/ti";
import EditLeadStages from './EditLeadStages';
import { Modal} from 'antd';
// import { DragHandle } from '@mui/icons-material';

const LeadStagesList = () => {
  const [selectedTab, setSelectedTab] = useState('sales');
  const [isEditLeadStagesModalVisible, setIsEditLeadStagesModalVisible] = useState(false);
  // Open Add Job Modal
	const openEditLeadStagesModal = () => {
		setIsEditLeadStagesModalVisible(true);
	};

	// Close Add Job Modal
	const closeEditLeadStagesModal = () => {
		setIsEditLeadStagesModalVisible(false);
	};  

  // Sample data for Sales and Marketing
  const salesData = [
    { id: 1, name: 'Draft', order: 1 },
    { id: 2, name: 'Open', order: 2 },
    { id: 3, name: 'Sent', order: 3 },
    { id: 4, name: 'Revised', order: 4 },
    { id: 5, name: 'Declined', order: 5 },
  ];

  const marketingData = [
    { id: 1, name: 'Draft', order: 1 },
    { id: 2, name: 'Open', order: 2 },
    { id: 3, name: 'Declined', order: 3 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Main Content */}
      <div className="flex-1 p-6">
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
                <button className="p-2 text-teal-500 hover:bg-teal-50 rounded-md transition-colors duration-200" onClick={openEditLeadStagesModal}>
                  <EditOutlined className=' text-xl'/>
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

        <Modal
					title="Edit Pipeline"
					visible={isEditLeadStagesModalVisible}
				    onCancel={closeEditLeadStagesModal}
					footer={null}
					width={700}
					className='mt-[-70px]'
				>
					<EditLeadStages onClose={closeEditLeadStagesModal} />
			</Modal>

      </div>
    </div>
  );
};

export default LeadStagesList;
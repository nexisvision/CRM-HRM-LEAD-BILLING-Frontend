import React, { useState, useEffect } from 'react'
import { Card, Table, Input, Button, Modal, } from 'antd';
import {SearchOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
// import { PaymentStatisticData } from '../../../dashboards/default/DefaultDashboardData';
import AddPipeLine from './AddPipeLine';
import EditPipeLine from './EditPipeLine';
import { useDispatch, useSelector } from 'react-redux';
import { GetPip } from './PiplineReducer/piplineSlice';

// const { Option } = Select;

const PipelineList = () => {
//   const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddPipeLineModalVisible, setIsAddPipeLineModalVisible] = useState(false);
  const [isEditPipeLineModalVisible, setIsEditPipeLineModalVisible] = useState(false);

  const Allpipline = useSelector((state) => state.Piplines);
  const Filterpipline = Allpipline?.Piplines?.data || [];

  const dispatch = useDispatch();

  // Open Add Pipeline Modal
  const openAddPipeLineModal = () => {
    setIsAddPipeLineModalVisible(true);
  };

  // Close Add Pipeline Modal
  const closeAddPipeLineModal = () => {
    setIsAddPipeLineModalVisible(false);
  };

  // Open Edit Pipeline Modal
  const openEditPipeLineModal = () => {
    setIsEditPipeLineModalVisible(true);
  };

  // Close Edit Pipeline Modal
  const closeEditPipeLineModal = () => {
    setIsEditPipeLineModalVisible(false);
  };

  const tableColumns = [
    {
      title: 'Pipeline',
      dataIndex: 'pipeline_name',
      sorter: (a, b) => utils.antdTableSorter(a, b, 'pipeline_name')
    },
    {
      title: 'Action',
      dataIndex: 'actions',
      render: (_, elm) => (
        <div className="flex space-x-2">
          <button className="p-2 text-teal-500 hover:bg-teal-50 rounded-md transition-colors duration-200" onClick={openEditPipeLineModal}>
            <EditOutlined className=' text-xl' />
          </button>
          <button className="p-2 text-pink-500 hover:bg-pink-50 rounded-md transition-colors duration-200">
            <DeleteOutlined className='text-xl' />
          </button>
        </div>
      )
    }
  ];

  const onSearch = e => {
    const value = e.currentTarget.value;
    const searchArray = e.currentTarget.value ? Filterpipline : Filterpipline;
    const data = utils.wildCardSearch(searchArray, value);
    setSelectedRowKeys([]);
  }

  useEffect(() => {
    dispatch(GetPip());
  }, [dispatch]);

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center'>
          <h1 className='text-lg font-bold'>Manage Pipeline</h1>
        </div>
        <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap mt-2 gap-4'>
          <div className='flex justify-end'>
            <Button type="primary" onClick={openAddPipeLineModal}>
              <PlusOutlined />
            </Button>
          </div>
        </Flex>
      </div>
      <Card>
        <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap mt-2 gap-4'>
          <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
          </div>
        </Flex>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={Filterpipline} // Use Filterpipline data here
            rowKey='id'
          />
        </div>
      </Card>

      <Modal
        title="Add Pipeline"
        visible={isAddPipeLineModalVisible}
        onCancel={closeAddPipeLineModal}
        footer={null}
        width={700}
      >
        <AddPipeLine onClose={closeAddPipeLineModal} />
      </Modal>

      <Modal
        title="Edit Pipeline"
        visible={isEditPipeLineModalVisible}
        onCancel={closeEditPipeLineModal}
        footer={null}
        width={700}
      >
        <EditPipeLine onClose={closeEditPipeLineModal} />
      </Modal>
    </>
  );
}

export default PipelineList;










// /* eslint-disable no-unused-vars */
// import React, { useState,useEffect } from 'react'
// import { Card, Table, Select, Input, Button, Badge, Menu, Tag, Modal, Row, Col } from 'antd';
// import OrderListData from "../../../../../assets/data/order-list.data.json"
// import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import Flex from 'components/shared-components/Flex'
// import utils from 'utils'
// import { PaymentStatisticData } from '../../../dashboards/default/DefaultDashboardData';
// import AddPipeLine from './AddPipeLine';
// import EditPipeLine from './EditPipeLine';
// import { useDispatch, useSelector } from 'react-redux';
// import { GetPip } from './PiplineReducer/piplineSlice';


// const { Option } = Select


// const PipelineList = () => {

// 	const [list, setList] = useState([])
// 	const [selectedRows, setSelectedRows] = useState([])
// 	const [selectedRowKeys, setSelectedRowKeys] = useState([])
// 	const [isAddPipeLineModalVisible, setIsAddPipeLineModalVisible] = useState(false);
// 	const [isEditPipeLineModalVisible, setIsEditPipeLineModalVisible] = useState(false);

//   const Allpipline = useSelector((state) => state.Piplines);
//   const Filterpipline = Allpipline?.Piplines?.data || [];


//   console.log("fsdf",Filterpipline);

// 	const dispatch = useDispatch();

// 	// Open Add Job Modal
// 	const openAddPipeLineModal = () => {
// 		setIsAddPipeLineModalVisible(true);
// 	};

// 	// Close Add Job Modal
// 	const closeAddPipeLineModal = () => {
// 		setIsAddPipeLineModalVisible(false);
// 	};

// 	// Open Add Job Modal
// 	const openEditPipeLineModal = () => {
// 		setIsEditPipeLineModalVisible(true);
// 	};

// 	// Close Add Job Modal
// 	const closeEditPipeLineModal = () => {
// 		setIsEditPipeLineModalVisible(false);
// 	};

// 	const tableColumns = [
// 		{
// 			title: 'Pipeline',
// 			dataIndex: 'pipeline',
// 			sorter: (a, b) => utils.antdTableSorter(a, b, 'pipeline')
// 		},

// 		{
// 			title: 'Action',
// 			dataIndex: 'actions',
// 			render: (_, elm) => (
// 				<div className="flex space-x-2">
//                   <button className="p-2 text-teal-500 hover:bg-teal-50 rounded-md transition-colors duration-200" onClick={openEditPipeLineModal}>
//                     <EditOutlined className=' text-xl' />
//                   </button>
//                   <button className="p-2 text-pink-500 hover:bg-pink-50 rounded-md transition-colors duration-200">
//                     <DeleteOutlined className='text-xl' />
//                   </button>
//                 </div>
// 			)
// 		}
// 	];


// 	const onSearch = e => {
// 		const value = e.currentTarget.value
// 		const searchArray = e.currentTarget.value ? list : OrderListData
// 		const data = utils.wildCardSearch(searchArray, value)
// 		setList(data)
// 		setSelectedRowKeys([])
// 	}

// 	useEffect(() => {
// 		dispatch(GetPip());
// 	}, [dispatch]);

// // 	useEffect(() => {
// // 	   setFilteredData(pipelinedata);
// //    }, [pipelinedata]);

// 	return (
// 		<>
// 		<div className='flex justify-between items-center mb-4'>
//         <div className='flex items-center'>
//           <h1 className='text-lg font-bold'>Manage Pipeline</h1>
//         </div>
//         <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap mt-2 gap-4'>
//           <div className='flex justify-end'>
//             <Button type="primary"  onClick={openAddPipeLineModal}>
//               <PlusOutlined />
//             </Button>
//           </div>
//         </Flex>
//       </div>
// 			<Card>
// 				<Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap mt-2 gap-4'>
					
// 						<div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
// 							<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
// 						</div>
// 				</Flex>
// 				<div className="table-responsive">
// 					<Table
// 						columns={tableColumns}
// 						dataSource={list}
// 						rowKey='id'
// 					// scroll={{x:1000}}
// 					// rowSelection={{
// 					// 	selectedRowKeys: selectedRowKeys,
// 					// 	type: 'checkbox',
// 					// 	preserveSelectedRowKeys: false,
// 					// 	...rowSelection,
// 					// }}
// 					/>
// 				</div>
// 			</Card>
// 			<Modal
// 				title="Add Pipeline"
// 				visible={isAddPipeLineModalVisible}
// 				onCancel={closeAddPipeLineModal}
// 				footer={null}
// 				width={700}
// 			// className='mt-[-70px]'
// 			>
// 				<AddPipeLine onClose={closeAddPipeLineModal} />
// 			</Modal>
// 			<Modal
// 				title="Edit Pipeline"
// 				visible={isEditPipeLineModalVisible}
// 				onCancel={closeEditPipeLineModal}
// 				footer={null}
// 				width={700}
// 			// className='mt-[-70px]'
// 			>
// 				<EditPipeLine onClose={closeEditPipeLineModal} />
// 			</Modal>

// 		</>
// 	)
// }

// export default PipelineList

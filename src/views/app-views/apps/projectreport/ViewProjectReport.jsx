import React, { useState } from 'react';
// import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, CopyOutlined, EditOutlined, LinkOutlined, FileExcelOutlined } from '@ant-design/icons';

import MilestonsList from './Milestones/MilestonesList';
import UserList from './Users/UserList';
import TableViewList from './ProjectViewTable/TableViewList';



function ViewProjectReport() {

    return (
        <>
            <div>
                <div className='bg-gray-50 ml-[-44px] mr-[-44px] mt-[-72px] mb-[-40px] rounded-t-lg rounded-b-lg p-4'>
                    <h2 className="mb-4 border-b pb-4 font-medium"></h2>
                    <div className='mt-3'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 rounded-lg'>
                        <div >
                            <UserList />
                        </div>
                        <div>
                            <MilestonsList />
                        </div>
                    </div>

                    <div>
                        <TableViewList />
                    </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ViewProjectReport;



// import React, { useState } from 'react';
// // import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
// import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, CopyOutlined, EditOutlined, LinkOutlined, FileExcelOutlined } from '@ant-design/icons';
// // import UserView from '../../../Users/user-list/UserView';
// // import Flex from 'components/shared-components/Flex';
// // import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import userData from 'assets/data/user-list.data.json';
// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import Flex from 'components/shared-components/Flex';
// import OrderListData from 'assets/data/order-list.data.json';

// import utils from 'utils';



// function ViewProjectReport() {
//     // const [dealStatisticViewData] = useState(DealStatisticViewData);
//     const [list, setList] = useState(OrderListData);
//     const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//     const [users, setUsers] = useState(userData);

//     const getProjectReportPriority = status => {
//         if (status === 'High') {
//             return 'orange'
//         }
//         if (status === 'Medium') {
//             return 'cyan'
//         }
//         if (status === 'Critical') {
//             return 'blue'
//         }
//         return ''
//     }

//     const getProjectReportStage = stage => {
//         if (stage === '	To Do') {
//             return 'orange'
//         }
//         if (stage === 'In Progress') {
//             return 'cyan'
//         }
//         if (stage === 'Done') {
//             return 'blue'
//         }
//         return ''
//     }

//     // Search functionality
//     const onSearch = (e) => {
//         const value = e.currentTarget.value;
//         const searchArray = value ? list : OrderListData;
//         const data = utils.wildCardSearch(searchArray, value);
//         setList(data);
//         setSelectedRowKeys([]);
//     };


//     const tableColumns = [
//         {
//             title: 'Task Name',
//             dataIndex: 'taskname',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'Milestone',
//             dataIndex: 'milestone',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'Start Date',
//             dataIndex: 'startdate',
//             sorter: {
//                 compare: (a, b) => a.title.length - b.title.length,
//             },
//         },
//         {
//             title: 'Due Date',
//             dataIndex: 'duedate',
//             sorter: {
//                 compare: (a, b) => a.title.length - b.title.length,
//             },
//         },
//         {
//             title: 'Assigned to',
//             dataIndex: 'assignedto',
//             render: (_, record) => (
//                 <div className="d-flex">
//                     <AvatarStatus size={30} src={record.image} />
//                 </div>
//             ),
//             sorter: {
//                 compare: (a, b) => a.title.length - b.title.length,
//             },
//         },
//         {
//             title: 'Total Logged Hours',
//             dataIndex: 'totalloggedhours',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'Priority',
//             dataIndex: 'status',
//             render: (_, record) => (
//                 <><Tag color={getProjectReportPriority(record.orderStatus)}>{record.orderStatus}</Tag></>
//             ),
//             sorter: {
//                 compare: (a, b) => a.title.length - b.title.length,
//             },
//         },
//         {
//             title: 'Stage',
//             dataIndex: 'stage',
//             render: (_, record) => (
//                 <><Tag color={getProjectReportStage(record.orderStatus)}></Tag></>
//             ),
//             sorter: {
//                 compare: (a, b) => a.title.length - b.title.length,
//             },
//         },

//         // {
//         //     title: 'Action',
//         //     dataIndex: 'actions',
//         //     render: (_, elm) => (
//         //         <div className="text-center">
//         //             <Button onClick={openViewProjectReportModal} className='bg-orange-400 text-white px-3 '>
//         //                 <EyeOutlined />
//         //             </Button>
//         //         </div>
//         //     ),
//         // },
//     ];



//     return (
//         <>


//             <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 rounded-lg'>
//                 <Card className=''>
//                     <div className="overflow-x-auto">
//                         <figcaption className='font-semibold text-lg mb-1'>Users</figcaption>
//                         <table className="w-full border border-gray-300 bg-white text-center text-xs">
//                             <thead className="bg-gray-100">
//                                 <tr>
//                                     <th className="px-4 py-2">Name</th>
//                                     <th className="px-4 py-2">Assigned Tasks</th>
//                                     <th className="px-4 py-2">	Done Tasks</th>
//                                     <th className="px-4 py-2">Logged Hours</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {/* Row 1 */}
//                                 <tr className='border-b'>
//                                     <td className="px-4 py-2">Workdo</td>
//                                     <td className="px-4 py-2">1</td>
//                                     <td className="px-4 py-2">0</td>
//                                     <td className="px-4 py-2">0</td>
//                                 </tr>
//                                 {/* Total Row */}
//                                 <tr>
//                                     <td className="px-4 py-2 text-center">
//                                         Buffy Walter
//                                     </td>
//                                     <td className="px-4 py-2">4</td>
//                                     <td className="px-4 py-2">2</td>
//                                     <td className="px-4 py-2">0</td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>

//                 </Card>

//                 <Card>
//                     <div className="overflow-x-auto">
//                         <figcaption className='font-semibold text-lg mb-1'>Milestones</figcaption>
//                         <table className="w-full border border-gray-300 bg-white text-center text-xs">
//                             <thead className="bg-gray-100">
//                                 <tr>
//                                     <th className="px-4 py-2">Name</th>
//                                     <th className="px-4 py-2">	Progress</th>
//                                     <th className="px-4 py-2">Cost</th>
//                                     <th className="px-4 py-2">Status</th>
//                                     <th className="px-4 py-2">Start Date</th>
//                                     <th className="px-4 py-2">End Date</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                 <tr>
//                   <td colSpan="6" className="text-center px-4 py-2 border">
//                     No milestones available
//                   </td>
//                 </tr>
//               </tbody>
//                         </table>
//                     </div>

//                 </Card>
//             </div>


//             <Flex alignItems="center" mobileFlex={false} className='flex justify-end mb-3'>
//                 <Flex gap="7px" >
//                     <Button type="primary" className='flex items-center' icon={<FileExcelOutlined />} block>
//                         Export
//                     </Button>
//                 </Flex>
//             </Flex>
//             <Card className='border-2'>

//                 <Flex alignItems="center" mobileFlex={false} className='flex justify-end'>
//                     <Flex className="mb-1" mobileFlex={false}>
//                         <div className="mr-md-3 mb-3">
//                             <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
//                         </div>
//                     </Flex>
//                 </Flex>

//                 <div className="table-responsive mt-2">
//                     <Table
//                         columns={tableColumns}
//                         dataSource={users}
//                         rowKey="id"
//                         scroll={{ x: 1200 }}
//                     />
//                 </div>
//             </Card>


//         </>
//     )
// }

// export default ViewProjectReport;

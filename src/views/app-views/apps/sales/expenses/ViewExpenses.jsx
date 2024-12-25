import React from 'react';
import { Modal, Row, Col, Typography, Button } from 'antd';

const { Title, Text } = Typography;

const ViewExpenses = ({ visible, onClose, expenseData }) => {
  // Sample data (replace `expenseData` with props or API data)
  const data = expenseData || {
    date: '05-15-2024',
    client: 'Dellon Inc',
    project: 'Mobile banking app development',
    recordedBy: 'Faith Hamilton',
    description: 'Web hosting',
    fileAttachment: 'Receipt.png',
    fileLink: '#',
    financial: { billable: true, invoiced: false },
    amount: '$480.00',
  };

  return (
    // <Modal
    //   title="Expense Record"
    //   visible={visible}
    //   footer={null}
    //   onCancel={onClose}
    //   centered
    // >
    <>
    <div>
      <div className='bg-gray-50 ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-2'>
      <h2 className="mb-4 border-b pb-[50px] font-medium"></h2>
    <div className="m-4">
      <Row gutter={[]} >
        <Col span={8} className='border p-2'>
          <Text strong>Date</Text>
        </Col>
        <Col span={16} className='border p-2'>
          <Text>{data.date}</Text>
        </Col>

        <Col span={8} className='border p-2'>
          <Text strong>Client</Text>
        </Col>
        <Col span={16} className='border p-2'>
          <Text>{data.client}</Text>
        </Col>

        <Col span={8} className='border p-2'>
          <Text strong>Project</Text>
        </Col>
        <Col span={16} className='border p-2'>
          <Text>{data.project}</Text>
        </Col>

        <Col span={8} className='border p-2'>
          <Text strong>Recorded By</Text>
        </Col>
        <Col span={16} className='border p-2'>
          <Text>{data.recordedBy}</Text>
        </Col>

        <Col span={8} className='border p-2'>
          <Text strong>Description</Text>
        </Col>
        <Col span={16} className='border p-2'>
          <Text>{data.description}</Text>
        </Col>

        <Col span={8} className='border p-2'>
          <Text strong>File Attachment</Text>
        </Col>
        <Col span={16} className='border p-2'>
          <a href={data.fileLink} target="_blank" rel="noopener noreferrer">
            {data.fileAttachment}
          </a>
        </Col>

        <Col span={8} className='border p-2'>
          <Text strong>Financial</Text>
        </Col>
        <Col span={16} className='border p-2'>
          <Button type="primary" size="small" disabled={!data.financial.billable}>
            Billable
          </Button>
          <Button type="default" size="small" disabled={data.financial.invoiced}>
            Not Invoiced
          </Button>
        </Col>

        <Col span={8} className='border p-2'>
          <Text strong>Amount</Text>
        </Col>
        <Col span={16} className='border p-2'>
          <Text>{data.amount}</Text>
        </Col>
      </Row>
    </div>
      </div>
    </div>
      </>
    // {/* </Modal> */}
  );
};

export default ViewExpenses;









// import React, { useState } from 'react';
// import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
// import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
// import UserView from '../../../Users/user-list/UserView';
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import userData from 'assets/data/user-list.data.json';


// function ViewExpenses() {
//     // const [dealStatisticViewData] = useState(DealStatisticViewData);

//     const [users, setUsers] = useState(userData);

//     return (
//         <>

//             {/* Title */}
//             <h1 className="text-xl ms-4 font-medium">Expense Detail</h1>
//             <Card className='border-0'>

//                 <div className="p-6 bg-white shadow rounded-lg">

//                     {/* Expense Info */}
//                     <div className="bg-white">
//                         {/* Header */}
//                         <div className="flex justify-between items-center border-b pb-4 mb-4">
//                             <h2 className="text-base font-medium">Expense</h2>
//                             <span className="text-base font-medium text-gray-800">#EXP00001</span>
//                         </div>

//                         {/* Content */}
//                         <div className="grid grid-cols-3 gap-8">
//                             {/* Billed To */}
//                             <div>
//                                 <h3 className="font-medium text-gray-700 mb-2">Billed To :</h3>
//                                 <p className="text-gray-800">Kim J Gibson</p>
//                                 <p className="text-gray-600">Roshita Apartment</p>
//                                 <p className="text-gray-600">Borivali</p>
//                                 <p className="text-gray-600">GUJARAT, 395006</p>
//                                 <p className="text-gray-600">India</p>
//                                 <p className="text-gray-600">04893258663</p>
//                                 <p className="text-gray-600 font-medium mt-2">Tax Number :</p>
//                                 <div className='mt-3'>
//                                     <h3 className="font-medium text-gray-700 mb-2">Status :</h3>
//                                     <span className="px-3 py-2 bg-green-400 text-white font-medium text-xs rounded-sm">
//                                         Paid
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Shipped To */}
//                             <div>
//                                 <h3 className="font-medium text-gray-700 mb-2">Shipped To :</h3>
//                                 <p className="text-gray-800">Kim J Gibson</p>
//                                 <p className="text-gray-600">Roshita Apartment</p>
//                                 <p className="text-gray-600">Borivali</p>
//                                 <p className="text-gray-600">GUJARAT, 395006</p>
//                                 <p className="text-gray-600">India</p>
//                                 <p className="text-gray-600">04893258663</p>
//                             </div>

//                             {/* Payment Date */}
//                             <div>
//                                 <h3 className="font-medium text-gray-700 mb-2">Payment Date :</h3>
//                                 <p className="text-gray-800 mb-4">05-01-2024</p>

//                             </div>
//                         </div>
//                     </div>


//                     <div className="pt-6 bg-white">
//                         {/* Heading */}
//                         <h1 className="text-sm font-medium mb-1">Product Summary</h1>
//                         <p className="text-xs text-gray-500 mb-2">
//                             All items here cannot be deleted.
//                         </p>

//                         {/* Table */}
//                         <div className="overflow-x-auto">
//                             <table className="w-full border border-gray-300 bg-white text-center text-xs">
//                                 <thead className="bg-gray-100">
//                                     <tr>
//                                         <th className="px-2 py-2">#</th>
//                                         <th className="px-2 py-2">Product</th>
//                                         <th className="px-2 py-2">Quantity</th>
//                                         <th className="px-2 py-2">Rate</th>
//                                         <th className="px-2 py-2">Discount</th>
//                                         <th className="px-2 py-2">Tax</th>
//                                         <th className="px-2 py-2">Chart Of Account</th>
//                                         <th className="px-2 py-2">Account Amount</th>
//                                         <th className="px-2 py-2">Description</th>
//                                         <th className="px-2 py-2">
//                                             <span>Price</span>
//                                             <br />
//                                             <span className="text-red-500">(after tax & discount)</span>

//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {/* Row 1 */}
//                                     <tr>
//                                         <td className="px-4 py-2">1</td>
//                                         <td className="px-4 py-2">Refrigerator</td>
//                                         <td className="px-4 py-2">1 (Piece)</td>
//                                         <td className="px-4 py-2">USD 60.000,00</td>
//                                         <td className="px-4 py-2">USD 0.00</td>
//                                         <td className="px-4 py-2 text-center">
//                                             <tr><p className='flex gap-3'><span>CGST (10%%)</span><span>USD 6.000,00</span></p></tr>
//                                             <tr><p className='flex gap-5'><span>SGST (5%%)</span><span>USD  3.000,00</span></p></tr>
//                                         </td>
//                                         <td className="px-4 py-2">Petty Cash</td>
//                                         <td className="px-4 py-2">USD 1.200,00</td>
//                                         <td className="px-4 py-2">
//                                             Giving information on its origins.
//                                         </td>
//                                         <td className="px-4 py-2">USD 69.000,00</td>
//                                     </tr>
//                                     {/* Total Row */}
//                                     <tr className="bg-gray-100 font-semibold">
//                                         <td className="px-4 py-2 text-center" colSpan="2">
//                                             Total
//                                         </td>
//                                         <td className="px-4 py-2">1</td>
//                                         <td className="px-4 py-2">USD 60.000,00</td>
//                                         <td className="px-4 py-2">USD 0,00</td>
//                                         <td className="px-4 py-2">USD 9.000,00</td>
//                                         <td className="px-4 py-2"></td>
//                                         <td className="px-4 py-2">USD 1.200,00</td>
//                                         <td className="px-4 py-2"></td>
//                                         <td className="px-4 py-2"></td>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* Summary Details */}
//                         <div className="mt-3 flex flex-col items-end space-y-2 text-xs">
//                             <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                                 <span className="text-gray-700 font-medium">Sub Total</span>
//                                 <span className="text-gray-700">USD 60.000,00</span>
//                             </div>
//                             <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                                 <span className="text-gray-700 font-medium">Discount</span>
//                                 <span className="text-gray-700">USD 0,00</span>
//                             </div>
//                             <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                                 <span className="text-gray-700 font-medium">CGST</span>
//                                 <span className="text-gray-700">USD 6.000,00</span>
//                             </div>
//                             <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                                 <span className="text-gray-700 font-medium">SGST</span>
//                                 <span className="text-gray-700">USD 3.000,00</span>
//                             </div>
//                             <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                                 <span className="text-gray-700 font-medium">Total</span>
//                                 <span className="text-gray-700">USD 69.000,00</span>
//                             </div>
//                             <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                                 <span className="text-gray-700 font-medium">Paid</span>
//                                 <span className="text-gray-700">USD 70.200,00</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </Card>

//             {/* <Card className='border-0'>

//                 <div className="p-6 bg-gray-50">
//                     <h1 className="text-sm font-medium mb-1">Product Summary</h1>
//                     <p className="text-xs text-gray-500 mb-2">
//                         All items here cannot be deleted.
//                     </p>

//                     <div className="overflow-x-auto">
//                         <table className="w-full border border-gray-300 bg-white text-center text-xs">
//                             <thead className="bg-gray-100">
//                                 <tr>
//                                     <th className="px-2 py-2">#</th>
//                                     <th className="px-2 py-2">Product</th>
//                                     <th className="px-2 py-2">Quantity</th>
//                                     <th className="px-2 py-2">Rate</th>
//                                     <th className="px-2 py-2">Discount</th>
//                                     <th className="px-2 py-2">Tax</th>
//                                     <th className="px-2 py-2">Chart Of Account</th>
//                                     <th className="px-2 py-2">Account Amount</th>
//                                     <th className="px-2 py-2">Description</th>
//                                     <th className="px-2 py-2">
//                                         <span>Price</span>
//                                         <br />
//                                         <span className="text-red-500">(after tax & discount)</span>

//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody>

//                                 <tr>
//                                     <td className="px-4 py-2">1</td>
//                                     <td className="px-4 py-2">Refrigerator</td>
//                                     <td className="px-4 py-2">1 (Piece)</td>
//                                     <td className="px-4 py-2">USD 60.000,00</td>
//                                     <td className="px-4 py-2">USD 0.00</td>
//                                     <td className="px-4 py-2 text-center">
//                                         <tr><p className='flex gap-3'><span>CGST (10%%)</span><span>USD 6.000,00</span></p></tr>
//                                         <tr><p className='flex gap-5'><span>SGST (5%%)</span><span>USD  3.000,00</span></p></tr>
//                                     </td>
//                                     <td className="px-4 py-2">Petty Cash</td>
//                                     <td className="px-4 py-2">USD 1.200,00</td>
//                                     <td className="px-4 py-2">
//                                     Giving information on its origins.
//                                     </td>
//                                     <td className="px-4 py-2">USD 69.000,00</td>
//                                 </tr>
                               
//                                 <tr className="bg-gray-100 font-semibold">
//                                     <td className="px-4 py-2 text-center" colSpan="2">
//                                         Total
//                                     </td>
//                                     <td className="px-4 py-2">1</td>
//                                     <td className="px-4 py-2">USD 60.000,00</td>
//                                     <td className="px-4 py-2">USD 0,00</td>
//                                     <td className="px-4 py-2">USD 9.000,00</td>
//                                     <td className="px-4 py-2"></td>
//                                     <td className="px-4 py-2">USD 1.200,00</td>
//                                     <td className="px-4 py-2"></td>
//                                     <td className="px-4 py-2"></td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>

//                     <div className="mt-3 flex flex-col items-end space-y-2 text-xs">
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700 font-medium">Sub Total</span>
//                             <span className="text-gray-700">USD 60.000,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700 font-medium">Discount</span>
//                             <span className="text-gray-700">USD 0,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700 font-medium">CGST</span>
//                             <span className="text-gray-700">USD 6.000,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700 font-medium">SGST</span>
//                             <span className="text-gray-700">USD 3.000,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700 font-medium">Total</span>
//                             <span className="text-gray-700">USD 69.000,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700 font-medium">Paid</span>
//                             <span className="text-gray-700">USD 70.200,00</span>
//                         </div>
//                     </div>
//                 </div>
//             </Card> */}
//         </>
//     )
// }

// export default ViewExpenses;

import React from "react";
import { Row, Col, Divider, Badge, Card } from "antd";
import { 
  StarFilled, 
  StarOutlined, 
  UserOutlined, 
  BankOutlined, 
  CalendarOutlined,
  TrophyOutlined 
} from '@ant-design/icons';

const ViewAppraisal = () => {
    const data = [
        {
            category: "Behavioural Competencies",
            icon: "🎯",
            color: "#6366F1", // Indigo
            items: [
                { name: "Business Process", indicator: 4, appraisal: 4 },
                { name: "Oral Communication", indicator: 3, appraisal: 4 },
            ],
        },
        {
            category: "Organizational Competencies",
            icon: "🏢",
            color: "#0EA5E9", // Sky blue
            items: [
                { name: "Leadership", indicator: 4, appraisal: 4 },
                { name: "Project Management", indicator: 5, appraisal: 5 },
            ],
        },
        {
            category: "Technical Competencies",
            icon: "⚡",
            color: "#10B981", // Emerald
            items: [
                { name: "Allocating Resources", indicator: 2, appraisal: 2 },
            ],
        },
    ];

    const renderStars = (count) => {
        return (
            <div className="flex gap-1.5">
                {[...Array(5)].map((_, index) => (
                    index < count ? (
                        <StarFilled key={index} className="text-amber-400 text-sm sm:text-base lg:text-lg transition-all" />
                    ) : (
                        <StarOutlined key={index} className="text-gray-200 text-sm sm:text-base lg:text-lg transition-all" />
                    )
                ))}
            </div>
        );
    };

    return (
        <div className="rounded-2xl">
            {/* Header Banner */}
            <Card className="mb-6 overflow-hidden">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 rounded-t-xl" />
                    <div className="relative px-6 py-8">
                        <div className="flex items-center gap-3 mb-8">
                            <TrophyOutlined className="text-2xl text-yellow-400" />
                            <h1 className="text-xl md:text-2xl font-semibold text-white m-0">
                                Performance Appraisal Review
                            </h1>
                        </div>
                        
                        <Row gutter={[24, 24]} className="items-start">
                            <Col xs={24} sm={12} lg={8}>
                                <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <BankOutlined className="text-blue-600 text-lg" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-sm">Branch</span>
                                            <span className="text-gray-800 font-medium">China</span>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} lg={8}>
                                <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <UserOutlined className="text-blue-600 text-lg" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-sm">Employee</span>
                                            <span className="text-gray-800 font-medium">Sonya Sims</span>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} lg={8}>
                                <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <CalendarOutlined className="text-blue-600 text-lg" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-sm">Appraisal Date</span>
                                            <span className="text-gray-800 font-medium">2022-10</span>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* Rating Headers */}
                <div className="mt-6 grid grid-cols-12 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="col-span-12 md:col-span-4">
                        <h3 className="text-gray-600 font-medium m-0">Competency</h3>
                    </div>
                    <div className="col-span-12 md:col-span-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <h3 className="text-gray-600 font-medium m-0">Indicator</h3>
                            </div>
                            <div className="text-center">
                                <h3 className="text-gray-600 font-medium m-0">Appraisal</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Competencies Sections */}
                <div className="space-y-6 mt-6">
                    {data.map((section, index) => (
                        <Card 
                            key={index} 
                            className="overflow-hidden hover:shadow-md transition-shadow duration-300"
                            bodyStyle={{ padding: 0 }}
                        >
                            <div className="p-4 border-b" style={{ backgroundColor: `${section.color}08` }}>
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{section.icon}</span>
                                    <h2 className="text-lg font-semibold text-gray-800 m-0">
                                        {section.category}
                                    </h2>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="space-y-4">
                                    {section.items.map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className="grid grid-cols-12 gap-6 items-center p-3 hover:bg-gray-50 rounded-xl transition-all duration-200"
                                        >
                                            <div className="col-span-12 md:col-span-4">
                                                <span className="text-gray-700 font-medium">{item.name}</span>
                                            </div>
                                            <div className="col-span-12 md:col-span-8">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex justify-center">
                                                        {renderStars(item.indicator)}
                                                    </div>
                                                    <div className="flex justify-center">
                                                        {renderStars(item.appraisal)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Remark Section */}
                <Divider className="my-6" />
                <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Badge color="#4F46E5" />
                        <h2 className="text-lg font-semibold text-gray-800 m-0">
                            Remark
                        </h2>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-gray-700 leading-relaxed m-0">
                            It is the process of evaluating individual job performance as a basis for making objective personnel decisions.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ViewAppraisal;



// import React from 'react';
// import { Modal, Rate } from 'antd';

// const ViewAppraisal = ({ visible, onClose }) => {
//   const data = [
//     {
//       category: 'Behavioural Competencies',
//       items: [
//         { name: 'Business Process', indicatorRating: 4, appraisalRating: 4 },
//         { name: 'Oral Communication', indicatorRating: 4, appraisalRating: 3 },
//       ],
//     },
//     {
//       category: 'Organizational Competencies',
//       items: [
//         { name: 'Leadership', indicatorRating: 3, appraisalRating: 3 },
//         { name: 'Project Management', indicatorRating: 4, appraisalRating: 4 },
//       ],
//     },
//     {
//       category: 'Technical Competencies',
//       items: [
//         { name: 'Allocating Resources', indicatorRating: 2, appraisalRating: 2 },
//       ],
//     },
//   ];

//   return (
//     // <Modal
//     //   title="Appraisal Detail"
//     //   visible={visible}
//     //   footer={null}
//     //   onCancel={onClose}
//     //   width={700}
//     // >
//     <>
//           <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

//       <div className="mb-4">
//         <p>
//           <strong>Branch:</strong> China
//           <span className="ml-4">
//             <strong>Employee:</strong> Sonya Sims
//           </span>
//           <span className="ml-4">
//             <strong>Appraisal Date:</strong> 2022-10
//           </span>
//         </p>
//       </div>

//       <div className="mb-4">
//         <h3 className="font-semibold text-lg mb-2">Indicator</h3>
//         {data.map((section, index) => (
//           <div key={index} className="mb-4">
//             <h3 className="font-semibold text-lg mb-2">{section.category}</h3>
//             {section.items.map((item, idx) => (
//               <div key={idx} className="flex justify-between items-center mb-2">
//                 <span>{item.name}</span>
//                 <div className="flex space-x-4">
//                   <Rate disabled value={item.indicatorRating} />
//                   <Rate disabled value={item.appraisalRating} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>

//       <div>
//         <h3 className="font-semibold text-lg mb-2">Remark</h3>
//         <p>
//           It is the process of evaluating individual job performance as a basis for making objective personnel decisions.
//         </p>
//       </div>
//     {/* </Modal> */}
//     </>
//   );
// };

// export default ViewAppraisal;

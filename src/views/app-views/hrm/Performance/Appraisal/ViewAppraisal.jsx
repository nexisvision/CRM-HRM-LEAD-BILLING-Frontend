import React from "react";

const ViewAppraisal = () => {
    const data = [
        {
            category: "Behavioural Competencies",
            items: [
                { name: "Business Process", indicator: 4, appraisal: 4 },
                { name: "Oral Communication", indicator: 3, appraisal: 4 },
            ],
        },
        {
            category: "Organizational Competencies",
            items: [
                { name: "Leadership", indicator: 4, appraisal: 4 },
                { name: "Project Management", indicator: 5, appraisal: 5 },
            ],
        },
        {
            category: "Technical Competencies",
            items: [
                { name: "Allocating Resources", indicator: 2, appraisal: 2 },
            ],
        },
    ];

    const renderStars = (count) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, index) => (
                    <span
                        key={index}
                        className={`text-2xl ${index < count ? "text-yellow-300" : "text-gray-300"}`}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="bg-gray-50 mx-[-24px] mb-[-22px] mt-[-55px] p-4 rounded-t-lg rounded-b-lg">
                <hr style={{ marginTop: "35px", border: '1px solid #e8e8e8' }} />
                <div className="mt-10">
                    <div className="">
                        <div className="container p-2">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0  w-96">
                                {/* Left Section */}
                                <div className="flex flex-col space-y-2">
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Branch</span>: China
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Employee</span>: Sonya Sims
                                    </p>
                                </div>
                                {/* Right Section */}
                                <div className="sm:text-right">
                                <p className="text-gray-700 sm:hidden">
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Appraisal Date</span>: 2022-10
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* <div className="flex justify-between text-sm text-gray-600">
                            <p><span className="font-medium">Branch:</span> China</p>
                            <p><span className="font-medium">Employee:</span> Sonya Sims</p>
                            <p><span className="font-medium">Appraisal Date:</span> 2022-10</p>
                        </div> */}
                    </div>

                    <div className="flex justify-center items-center mb-4">
                    <p className="text-base text-gray-700 w-1/3"></p>
                        <div className="flex-1 text-base flex justify-between font-semibold">
                            <div className="flex items-center gap-2 w-1/2">
                                <h1>Indicator</h1>
                            </div>
                            <div className="flex items-center gap-2 w-1/2">
                                <h1>Appraisal</h1>
                            </div>
                        </div>
                    </div>
                    {data.map((section, index) => (
                        <div key={index} className="mb-6">
                            <h3 className="sm:text-base md:text-lg font-semibold mb-3 border-b pb-2">
                                {section.category}
                            </h3>
                            {section.items.length > 0 ? (
                                section.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start md:items-center mb-3">
                                        <p className="text-sm text-gray-700 w-1/3">{item.name}</p>
                                        <div className="flex-1 flex justify-between">
                                            <div className="flex items-center gap-2 w-1/2">
                                                {renderStars(item.indicator)}
                                            </div>
                                            <div className="flex items-center gap-2 w-1/2">
                                                {renderStars(item.appraisal)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No data available</p>
                            )}
                        </div>
                    ))}
                    <div className="border-t pt-4 ">
                            <h1 className="font-semibold  text-base">Remark</h1>
                            <p className="text-gray-700 mt-4">It is the process of evaluating individual job performance as a basis for making objective personnel decisions.</p>
                    </div>
                </div>
            </div>
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

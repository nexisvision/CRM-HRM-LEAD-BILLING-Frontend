import React from 'react';
import { Card, Row, Col } from 'antd';
import {
  PaperClipOutlined,
  MessageOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const General = () => {
  return (
    <div className="">
      <Row gutter={[16, 16]} className="flex md:flex-nowrap flex-wrap">
        <Col xs={24} md={12} lg={8}>
          <Card className="text-center bg-green-100">
            <PaperClipOutlined style={{ fontSize: '24px', color: '#34c759' }} />
            <div className="font-semibold mt-2 text-green-600">Attachment</div>
            <div className="text-lg font-bold">2</div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card className="text-center bg-orange-100">
            <MessageOutlined style={{ fontSize: '24px', color: '#ff9500' }} />
            <div className="font-semibold mt-2 text-orange-600">Comment</div>
            <div className="text-lg font-bold">2</div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card className="text-center bg-blue-100">
            <FileTextOutlined style={{ fontSize: '24px', color: '#007aff' }} />
            <div className="font-semibold mt-2 text-blue-600">Notes</div>
            <div className="text-lg font-bold">1</div>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Card className="bg-white">
            <div className="font-semibold text-lg mb-2">Contract Detail</div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div>
                  <b>Subject:</b> Software Development Contract
                </div>
                <div>
                  <b>Project:</b> Bootstrap Framework
                </div>
                <div>
                  <b>Value:</b> USD 80,00
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <b>Type:</b> Marketing
                </div>
                <div>
                  <b>Status:</b> Accept
                </div>
                <div>
                  <b>Start Date:</b> 07-10-2022
                </div>
                <div>
                  <b>End Date:</b> 08-12-2022
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row className="">
        <Col span={24}>
          <Card className="bg-white">
            <div className="font-semibold text-lg mb-2">Contract Description</div>
            <div className="text-justify">
              <p>
                Exceptuer sint occaecat cupidatat non proident, sunt in culpa qui
                officia deserunt mollit anim id est laborum.
              </p>
              <p>
                <strong>Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</strong>
              </p>
              <p>
                "Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
                ab illo inventore veritatis et quasi architecto beatae vitae dicta
                sunt explicabo."
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default General;

// import React from 'react';
// import { Card, Row, Col } from 'antd';
// import {
//   PaperClipOutlined,
//   MessageOutlined,
//   FileTextOutlined,
//   CalendarOutlined,
// } from '@ant-design/icons';

// const General = () => {
//   return (
//     <div className="">
//       <Row gutter={[16, 16]} className="flex md:flex-nowrap flex-wrap">
//         <Col span={6}>
//           <Card className="text-center bg-green-100">
//             <PaperClipOutlined style={{ fontSize: '24px', color: '#34c759' }} />
//             <div className="font-semibold mt-2 text-green-600">Attachment</div>
//             <div className="text-lg font-bold">2</div>
//           </Card>
//         </Col>

//         <Col span={6}>
//           <Card className="text-center bg-orange-100">
//             <MessageOutlined style={{ fontSize: '24px', color: '#ff9500' }} />
//             <div className="font-semibold mt-2 text-orange-600">Comment</div>
//             <div className="text-lg font-bold">2</div>
//           </Card>
//         </Col>

//         <Col span={6}>
//           <Card className="text-center bg-blue-100">
//             <FileTextOutlined style={{ fontSize: '24px', color: '#007aff' }} />
//             <div className="font-semibold mt-2 text-blue-600">Notes</div>
//             <div className="text-lg font-bold">1</div>
//           </Card>
//         </Col>
//       </Row>

//       <Row>
//         <Col span={24}>
//           <Card className="bg-white">
//             <div className="font-semibold text-lg mb-2">Contract Detail</div>
//             <Row gutter={[16, 16]}>
//               <Col span={12}>
//                 <div>
//                   <b>Subject:</b> Software Development Contract
//                 </div>
//                 <div>
//                   <b>Project:</b> Bootstrap Framework
//                 </div>
//                 <div>
//                   <b>Value:</b> USD 80,00
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div>
//                   <b>Type:</b> Marketing
//                 </div>
//                 <div>
//                   <b>Status:</b> Accept
//                 </div>
//                 <div>
//                   <b>Start Date:</b> 07-10-2022
//                 </div>
//                 <div>
//                   <b>End Date:</b> 08-12-2022
//                 </div>
//               </Col>
//             </Row>
//           </Card>
//         </Col>
//       </Row>

//       <Row className="mt-4">
//         <Col span={24}>
//           <Card className="bg-white">
//             <div className="font-semibold text-lg mb-2">Contract Description</div>
//             <div className="text-justify">
//               <p>
//                 Exceptuer sint occaecat cupidatat non proident, sunt in culpa qui
//                 officia deserunt mollit anim id est laborum.
//               </p>
//               <p>
//                 <strong>Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</strong>
//               </p>
//               <p>
//                 "Sed ut perspiciatis unde omnis iste natus error sit voluptatem
//                 accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
//                 ab illo inventore veritatis et quasi architecto beatae vitae dicta
//                 sunt explicabo."
//               </p>
//             </div>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default General;
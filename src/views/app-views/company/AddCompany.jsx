// import React, { useState } from "react";
// import { Modal, Form, Input, Switch, Button, Row, Col } from "antd";
// import { useDispatch } from "react-redux";
// import { addClient, ClientData, empdata } from "./CompanyReducers/CompanySlice";

// const AddCompany = ({ visible, onClose, onCreate }) => {
//   const [form] = Form.useForm();
//   const [loginEnabled, setLoginEnabled] = useState(true);
//   const [showOtpPage, setShowOtpPage] = useState(false);
//   const dispatch = useDispatch()



//   const handleFinish = async (values) => {
//     try {
//       // Dispatch the addClient action and wait for it to complete
//       await dispatch(addClient(values)).unwrap();

//       console.log("Client Data Added Successfully:", values);

//       onClose();

//       // Fetch the latest client data
//       await dispatch(ClientData());

//       // Call the onCreate callback (if any)
//       onCreate(values);

//       // Reset the form fields
//       form.resetFields();

//       // Close the modal or form
//       setShowOtpPage(true);
//     } catch (error) {
//       console.error("Error Adding Client:", error);
//     }
//   };




//   const handleSwitchChange = (checked) => {
//     setLoginEnabled(checked);
//   };

//   return (
//     <div>

//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleFinish}
//         initialValues={{
//           loginEnabled: true,
//         }}
//       >
//         <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

//         <Form.Item
//           name="username"
//           label="Name"
//           rules={[{ required: true, message: "Please enter the client name" }]}
//         >
//           <Input placeholder="Enter client Name" />
//         </Form.Item>

//         <Form.Item
//           name="email"
//           label="E-Mail Address"
//           rules={[
//             { required: true, message: "Please enter the client email" },
//             { type: "email", message: "Please enter a valid email address" },
//           ]}
//         >
//           <Input placeholder="Enter Client Email" />
//         </Form.Item>

//         <Form.Item
//           name="loginEnabled"
//           label="Login is enabled"
//           valuePropName="checked"
//         >
//           <Switch onChange={handleSwitchChange} />
//         </Form.Item>

//         {/* Conditionally render password field based on loginEnabled state */}
//         {loginEnabled && (
//           <Form.Item
//             name="password"
//             label="Password"
//             rules={[{ required: loginEnabled, message: "Please enter the client password" }]}
//           >
//             <Input.Password placeholder="Enter Client Password" />
//           </Form.Item>
//         )}

//         <Form.Item>
//           <Row justify="end" gutter={16}>
//             <Col>
//               <Button onClick={onClose}>Cancel</Button>
//             </Col>
//             <Col>
//               <Button type="primary" htmlType="submit">
//                 Create
//               </Button>
//               {showOtpPage && (
//                 <div className="otp-page p-4 rounded-lg shadow-lg bg-white max-w-lg mx-auto mt-10">
//                   <h2 className="text-xl font-semibold mb-4">OTP Page</h2>
//                   <p>
//                     An OTP has been sent to your registered email. Please enter the OTP below to verify your account.
//                   </p>
//                   <Input
//                     placeholder="Enter OTP"
//                     className="mt-4 p-3 border border-gray-300 rounded-md"
//                     style={{ width: "100%" }}
//                   />
//                   <div className="mt-4">
//                     <Button type="primary" className="w-full">
//                       Verify OTP
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </Col>
//           </Row>
//         </Form.Item>
//       </Form>



//     </div>
//   )
// };




// export default AddCompany;



import React, { useState } from "react";
import { Form, Input, Switch, Button, Row, Col, Modal } from "antd";
import { useDispatch } from "react-redux";
import { addClient, ClientData } from "./CompanyReducers/CompanySlice";

const AddCompany = ({ visible, onClose, onCreate }) => {
  const [form] = Form.useForm();
  const [loginEnabled, setLoginEnabled] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false); // State for OTP modal visibility
  const dispatch = useDispatch();

  const handleFinish = async (values) => {
    try {
      // Dispatch the addClient action and wait for it to complete
      await dispatch(addClient(values)).unwrap();
      console.log("Client Data Added Successfully:", values);

      // Fetch the latest client data
      await dispatch(ClientData());

      // Close the Add Company modal
      onClose();

      // Call the onCreate callback (if any)
      onCreate(values);

      // Reset the form fields
      form.resetFields();

      // Open the OTP Modal after successfully adding the client
      setShowOtpModal(true);
    } catch (error) {
      console.error("Error Adding Client:", error);
    }
  };

  const handleSwitchChange = (checked) => {
    setLoginEnabled(checked);
  };

  const handleOtpVerify = () => {
    // Handle OTP verification logic here
    console.log("OTP Verified");

    // Close OTP modal after verification
    setShowOtpModal(false);
  };

  const onOpenOtpModal = () => {
    setShowOtpModal(true);
  };
  const onCloseOtpModal = () => {
    setShowOtpModal(false);
  };
  

  return (
    <div>
      {/* Add Company Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          loginEnabled: true,
        }}
      >
        <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

        <Form.Item
          name="username"
          label="Name"
          rules={[{ required: true, message: "Please enter the client name" }]}
        >
          <Input placeholder="Enter client Name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-Mail Address"
          rules={[
            { required: true, message: "Please enter the client email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input placeholder="Enter Client Email" />
        </Form.Item>

        <Form.Item
          name="loginEnabled"
          label="Login is enabled"
          valuePropName="checked"
        >
          <Switch onChange={handleSwitchChange} />
        </Form.Item>

        {/* Conditionally render password field based on loginEnabled state */}
        {loginEnabled && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: loginEnabled, message: "Please enter the client password" }]}
          >
            <Input.Password placeholder="Enter Client Password" />
          </Form.Item>
        )}

        <Form.Item>
          <Row justify="end" gutter={16}>
            <Col>
              <Button onClick={onClose}>Cancel</Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit" onClick={onOpenOtpModal}>
                Create
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>

      {/* OTP Modal */}
      <Modal
        title="Verify OTP"
        visible={showOtpModal} // Control visibility based on showOtpModal state
        onCancel={onCloseOtpModal} // Close OTP modal
        footer={null} // Remove footer buttons
        centered
      >
        <div className="p-4 rounded-lg bg-white">
          <h2 className="text-xl font-semibold mb-4">OTP Page</h2>
          <p>
            An OTP has been sent to your registered email. Please enter the OTP below to verify your account.
          </p>
          <Input
            placeholder="Enter OTP"
            className="mt-4 p-3 border border-gray-300 rounded-md"
            style={{ width: "100%" }}
          />
          <div className="mt-4">
            <Button type="primary" className="w-full" onClick={handleOtpVerify}>
              Verify OTP
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddCompany;






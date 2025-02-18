// import React, { useState } from 'react';
// import { Modal, Form, Input, Button, message } from 'antd';
// import { MailOutlined } from '@ant-design/icons';
// import { useDispatch } from 'react-redux';
// import { MdOutlineEmail } from 'react-icons/md';
// import { otpverifyemail, sendmailupdateotp } from './CompanyReducers/CompanySlice';

// const EmailVerification = ({ idd, visible, onCancel, companyId }) => {
//   const [form] = Form.useForm();
//   const [otpForm] = Form.useForm();
//   const [isLoading, setIsLoading] = useState(false);
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [verificationEmail, setVerificationEmail] = useState('');
//   const [step, setStep] = useState(1);
//   const dispatch = useDispatch();

//   // Handle Send OTP Click
//   const handleSendOtp = async () => {
//     try {
//       const values = await form.validateFields();
      
//       if (step === 1) {
//         dispatch(sendmailupdateotp({ idd, values }));
//         message.success('Verification code sent to your email');
//         setStep(2);
//       } else if (step === 2) {
//         dispatch(otpverifyemail(values));
//         message.success('Email verified successfully');
//         onCancel();
//       }
//     } catch (error) {
//       message.error('Please enter a valid email');
//     }
//   };

//   // Handle OTP Verification
//   const handleVerifyOtp = async (values) => {
//     try {
//       setIsLoading(true);
      
//       // Simulate OTP verification
//       setTimeout(() => {
//         message.success('Email verified successfully');
//         handleClose();
//       }, 1000);
//     } catch (error) {
//       message.error('Invalid OTP');
//       setIsLoading(false);
//     }
//   };

//   // Handle modal close
//   const handleClose = () => {
//     form.resetFields();
//     otpForm.resetFields();
//     setShowOtpModal(false);
//     setVerificationEmail('');
//     setIsLoading(false);
//     if (onCancel) {
//       onCancel();
//     }
//   };

//   // Handle email modal close
//   const handleEmailModalClose = () => {
//     form.resetFields();
//     setIsLoading(false);
//     if (onCancel) {
//       onCancel();
//     }
//   };

//   // Handle OTP modal close
//   const handleOtpModalClose = () => {
//     otpForm.resetFields();
//     setShowOtpModal(false);
//     setVerificationEmail('');
//     setIsLoading(false);
//     if (onCancel) {
//       onCancel();
//     }
//   };

//   return (
//     <>
//       {/* Email Input Modal */}
//       <Modal
//         title={
//           <div className="flex items-center gap-2 text-lg">
//             <MdOutlineEmail className="text-blue-500" />
//             <span>Email Verification</span>
//           </div>
//         }
//         open={visible && !showOtpModal}
//         onCancel={handleEmailModalClose}
//         maskClosable={false}
//         footer={null}
//         className="rounded-lg"
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             name="email"
//             label="Email Address"
//             rules={[
//               { required: true, message: 'Please enter your email' },
//               { type: 'email', message: 'Please enter a valid email' }
//             ]}
//           >
//             <Input 
//               placeholder="Enter your email"
//               className="rounded-md"
//             />
//           </Form.Item>
//           <div className="flex justify-end gap-2 mt-4">
//             <Button onClick={handleEmailModalClose}>
//               Cancel
//             </Button>
//             <Button
//               type="primary"
//               onClick={handleSendOtp}
//               loading={isLoading}
//               className="bg-blue-500 hover:bg-blue-600"
//             >
//               Send OTP
//             </Button>
//           </div>
//         </Form>
//       </Modal>

//       {/* OTP Verification Modal */}
//       <Modal
//         title={
//           <div className="flex items-center gap-2 text-lg">
//             <MdOutlineEmail className="text-blue-500" />
//             <span>Verify OTP</span>
//           </div>
//         }
//         open={showOtpModal}
//         onCancel={handleOtpModalClose}
//         maskClosable={false}
//         footer={null}
//         className="rounded-lg"
//       >
//         <Form form={otpForm} layout="vertical" onFinish={handleVerifyOtp}>
//           <div className="mb-4">
//             {/* <p className="text-gray-600">We've sent a verification code to:</p> */}
//             <p className="font-medium">{verificationEmail}</p>
//           </div>
//           <Form.Item
//             name="otp"
//             label="Enter OTP"
//             rules={[
//               { required: true, message: 'Please enter OTP' },
//               { len: 6, message: 'OTP must be 6 digits' }
//             ]}
//           >
//             <Input
//               placeholder="Enter 6-digit OTP"
//               maxLength={6}
//               className="rounded-md"
//             />
//           </Form.Item>
//           <div className="flex justify-end gap-2 mt-4">
//             <Button onClick={handleOtpModalClose}>
//               Cancel
//             </Button>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={isLoading}
//               className="bg-blue-500 hover:bg-blue-600"
//             >
//               Verify OTP
//             </Button>
//           </div>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// export default EmailVerification;





///////






import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { MdOutlineEmail } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { ClientData, otpverifyemail, sendmailupdateotp } from './CompanyReducers/CompanySlice';
import { GetUsers } from '../Users/UserReducers/UserSlice';
import { ClientData as NewClientData } from '../Users/client-list/CompanyReducers/CompanySlice';
import { empdata } from '../hrm/Employee/EmployeeReducers/EmployeeSlice';



const EmailVerification = ({idd, visible, onCancel, initialEmail }) => {
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();


  const handleSendOtp = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);
      
      // First API call to send OTP
      const response = await dispatch(sendmailupdateotp({ idd, values }));
      
      if (response.payload?.success) {  // Adjust condition based on your API response structure
        message.success('OTP sent successfully');
        setVerificationEmail(values.email);
        setShowOtpModal(true);
      } else {
        message.error('Failed to send OTP');
      }
    } catch (error) {
      message.error('Please enter a valid email');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async (values) => {
    try {
      setIsLoading(true);
      
      // Second API call to verify OTP
      const response = await dispatch(otpverifyemail(values));
      
      if (response.payload?.success) {  
        message.success('Email verified successfully');
        dispatch(ClientData())
         dispatch(GetUsers());
         dispatch(NewClientData())
         dispatch(empdata())
        handleClose();
      } else {
        message.error('Invalid OTP');
      }
    } catch (error) {
      message.error('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    form.resetFields();
    otpForm.resetFields();
    setShowOtpModal(false);
    setVerificationEmail('');
    setIsLoading(false);
    if (onCancel) {
      onCancel();
    }
  };

  // Handle email modal close
  const handleEmailModalClose = () => {
    form.resetFields();
    setIsLoading(false);
    if (onCancel) {
      onCancel();
    }
  };

  // Handle OTP modal close
  const handleOtpModalClose = () => {
    otpForm.resetFields();
    setShowOtpModal(false);
    setVerificationEmail('');
    setIsLoading(false);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
      {/* Email Input Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg">
            <MdOutlineEmail className="text-blue-500" />
            <span>Email Verification</span>
          </div>
        }
        open={visible && !showOtpModal}
        onCancel={handleEmailModalClose}
        maskClosable={false}
        footer={null}
        className="rounded-lg"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              placeholder="Enter your email"
              className="rounded-md"
            />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleEmailModalClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSendOtp}
              loading={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Send OTP
            </Button>
          </div>
        </Form>
      </Modal>

      {/* OTP Verification Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg">
            <MdOutlineEmail className="text-blue-500" />
            <span>Verify OTP</span>
          </div>
        }
        open={showOtpModal}
        onCancel={handleOtpModalClose}
        maskClosable={false}
        footer={null}
        className="rounded-lg"
      >
        <Form form={otpForm} layout="vertical" onFinish={handleVerifyOtp}>
          <div className="mb-4">
            {/* <p className="text-gray-600">We've sent a verification code to:</p> */}
            <p className="font-medium">{verificationEmail}</p>
          </div>
          <Form.Item
            name="otp"
            label="Enter OTP"
            rules={[
              { required: true, message: 'Please enter OTP' },
              { len: 6, message: 'OTP must be 6 digits' }
            ]}
          >
            <Input
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="rounded-md"
            />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleOtpModalClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Verify OTP
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default EmailVerification;

import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';


function ViewEmployee() {



  return (
    <>
    <div>
        <div className='bg-gray-50 mx-[-24px] mb-[-20px] mt-[-53px] rounded-t-lg rounded-b-lg px-4 pt-4 '>
        <h2 className=" border-b pb-[40px] font-medium"></h2>
        <div className='grid grid-cols-1 gap-3 '>
      <div className='mt-4'>
        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3'> 
        {/* <div className='flex mt-3 gap-3 flex-wrap sm:flex-nowrap md:flex-nowrap'>  */}
        <Card className='mt-2 w-full'>
          <div>
            <div className='flex justify-between border-b pb-2'>
              <h1 className='text-lg font-medium'>Personal Detail</h1>
            </div>
            <div className=' mt-2 p-2 lg:p-0'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2'>
                    <div>
                        <h6 ><span className='font-medium'>EmployeeId :</span> #EMP0000001</h6>
                        <h6><span className='font-medium'>Email :</span> keanu2006@gmail.com</h6>
                        <h6><span className='font-medium'>Phone :</span> 04893258663</h6>
                        <h6><span className='font-medium'>Salary Type :</span> Hourly Payslip</h6>
                    </div>
                    <div>
                        <h6><span className='font-medium'>Name :</span> Richard Atkinson</h6>
                        <h6><span className='font-medium'>Date of Birth :</span> 21-07-2021</h6>
                        <h6><span className='font-medium'>Address :</span> Roshita Apartment</h6>
                        <h6><span className='font-medium'>Basic Salary :</span> 15000</h6>
                    </div>
                </div>
            </div>
          </div>
        </Card>
        <Card className='mt-2 w-full'>
          <div>
            <div className='flex justify-between border-b pb-2'>
              <h1 className='text-lg font-medium'>Company Detail</h1>
              
            </div>
            <div className='mt-2 p-2 lg:p-0'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2'>
                    <div>
                        <h6><span className='font-medium'>Branch :</span> #India</h6>
                        <h6 className='md:mt-5 lg:mt-5'><span className='font-medium'>Designation :</span> Chartered</h6>
                    </div>
                    <div>
                        <h6><span className='font-medium'>Department :</span> Telecommunications</h6>
                        <h6><span className='font-medium'>Date Of Joining :</span> 01-01-2020</h6>
                    </div>
                </div>
            </div>
          </div>
        </Card>
        </div>
      </div>
      <div className=''>
        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3'> 
        {/* <div className='flex mt-3 gap-3 flex-wrap sm:flex-nowrap md:flex-nowrap'>  */}
        <Card className=' w-full'>
          <div>
            <div className='flex justify-between border-b pb-2'>
              <h1 className='text-lg font-medium'>Document Detail</h1>
            </div>
            <div className=' mt-2 p-2 lg:p-0'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2'>
                    <div>
                        <h6><span className='font-medium'>Certificate :</span></h6>
                    </div>
                    <div>
                        <h6><span className='font-medium'>Photo :</span> <a href="https://demo.workdo.io/erpgo-saas/storage/uploads/document/certificate.png" target='_blank' className='text-blue-500'> certificate.png</a></h6>
                    </div>
                </div>
            </div>
          </div>
        </Card>
        <Card className='w-full'>
          <div>
            <div className='flex justify-between border-b pb-2'>
              <h1 className='text-lg font-medium'>Bank Account Detail</h1>
              
            </div>
            <div className='mt-2 p-2 lg:p-0'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2'>
                    <div>
                        <h6><span className='font-medium'>Account Holder Name :</span> Test</h6>
                        <h6><span className='font-medium'>Bank Name :</span> Test</h6>
                        <h6><span className='font-medium'>Branch Location :</span> Vapi</h6>
                    </div>
                    <div>
                        <h6><span className='font-medium'>Account Number :</span> 14202546</h6>
                        <h6><span className='font-medium'>Bank Identifier Code :</span> 5879823</h6>
                        <h6><span className='font-medium'>Tax Payer Id :</span> 95682</h6>
                    </div>
                </div>
            </div>
          </div>
        </Card>
        </div>
      </div>
    </div>
        </div>
    </div>
    

        </>
  )
}

export default ViewEmployee

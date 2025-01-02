import React, { useState } from 'react';
import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';


function ViewPayment() {
    return (
        <>
         <h2 className="border-b pb-[5px] font-medium"></h2>
            <Card className='border-0'>
                <table class="table table-bordered w-full">
                    <tbody>
                        <tr>
                            <td className=' text-[#5b676d] p-2'>Amount</td>
                            <td className='  font-light  text-[#5b676d] p-2'>$30,644.00

</td>
                        </tr>
                        <tr class="font-16 font-weight-600">
                            <td className=' text-[#5b676d] p-2'>Payment On</td>
                            <td className='  font-light  text-[#5b676d] p-2'>Mon 14 Oct 2024</td>

                        </tr>
                        <tr>
                            <td className=' text-[#5b676d] p-2'>Invoice</td>
                            <td className='  font-light  text-[#5b676d] p-2'> INV#011</td>
                        </tr>
                        <tr>
                            <td className=' text-[#5b676d] p-2'>Project</td>
                            <td className='  font-light  text-[#5b676d] p-2'>Website Copier Project</td>
                        </tr>

                        <tr>
                            <td className=' text-[#5b676d] p-2'>Bank Account</td>
                            <td className='  font-light  text-[#5b676d] p-2'>Primary Account | Mayert-Treutel</td>
                        </tr>
                        <tr>
                            <td className=' text-[#5b676d] p-2'>Transaction Id</td>
                            <td className='  font-light  text-[#5b676d] p-2'>6512bd43d9caa6e02c990b0a82652dca</td>
                        </tr>
                        <tr>
                            <td className=' text-[#5b676d] p-2'>Gateway</td>
                            <td className='  font-light  text-[#5b676d] p-2'>Bank Transfer</td>
                        </tr>
                        <tr>
                            <td className=' text-[#5b676d] p-2'>Status</td>
                            <td className=' font-light  text-[#5b676d] p-2'>
                            Complete</td>
                        </tr>
                        <tr>
                            <td className=' text-[#5b676d] p-2'>Receipt</td>
                            <td className=' font-light  text-[#5b676d] p-2'>
                            --</td>
                        </tr>
                        <tr>
                            <td className=' text-[#5b676d] p-2'>Remark</td>
                            <td className=' font-light  text-[#5b676d] p-2'>
                            --</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </>
    )
}

export default ViewPayment;

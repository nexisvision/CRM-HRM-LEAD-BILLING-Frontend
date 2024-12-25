import React, { useState } from 'react';
import { Card,Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';

function CompantInfoList() {

   return (
         <Card className='border-0'>                
                  <div className=" p-3">
                     <h1 className="font-medium text-lg mb-4">Company Info</h1>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                           <h6 className="text-gray-600 text-sm">Customer Id</h6>
                           <h5 className="font-semibold text-base">#CUST02024</h5>
                        </div>
                        <div>
                           <h6 className="text-gray-600 text-sm">Date of Creation</h6>
                           <h5 className="font-semibold text-base">21-07-2021</h5>
                        </div>
                        <div>
                           <h6 className="text-gray-600 text-sm">Balance</h6>
                           <h5 className="font-semibold text-base">USD 100.009,00</h5>
                        </div>
                        <div>
                           <h6 className="text-gray-600 text-sm">Overdue</h6>
                           <h5 className="font-semibold text-base">USD 1.544,00</h5>
                        </div>
                        <div>
                           <h6 className="text-gray-600 text-sm">Total Sum of Invoices</h6>
                           <h5 className="font-semibold text-base">USD 105.855,00</h5>
                        </div>
                        <div>
                           <h6 className="text-gray-600 text-sm">Quantity of Invoice</h6>
                           <h5 className="font-semibold text-base">3</h5>
                        </div>
                        <div>
                           <h6 className="text-gray-600 text-sm">Average Sales</h6>
                           <h5 className="font-semibold text-base">USD 35.285,00</h5>
                        </div>
                     </div>
                  </div>
         </Card>
   )
}

export default CompantInfoList

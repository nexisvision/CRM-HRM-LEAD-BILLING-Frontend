
import React, { useState } from 'react';
import CompantInfoList from './CompanyInfo/CompanyInfoList';
import CustomerInvoiceList from './Invoice/CustomerInvoiceList';
import ProposalList from './Proposal/ProposalList';


function ViewCustomer() {
   return (
      <>
        <div>
         <div className='bg-gray-50 ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4'>
         <h2 className="mb-4 border-b pb-[30px] font-medium"></h2>
              <div className='mt-3'>
              <CompantInfoList/>
              </div>
              <div>
                <ProposalList/>
              </div>
              <div>
              <CustomerInvoiceList/>
              </div>
         </div>
        </div>
      </>
  )
      
}

export default ViewCustomer;


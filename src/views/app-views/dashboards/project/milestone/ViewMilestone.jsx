import React, { useState } from 'react';
import ComplatedList from './Complated/ComplatedList';
import GeneralList from './General/GeneralList';



function ViewMilestone() {
    return (
        <>
            <div className="p-6 bg-gray-100 min-h-screen ml-[-23px] mr-[-23px] mb-[-23px] mt-[-51px] rounded-t-lg">
                {/* <hr style={{ marginTop:"25px", border: '1px solid #e8e8e8' }} /> */}
                <div className="grid mt-[30px]">
                    <div className='flex flex-col md:flex-row lg:flex-row gap-6'>
                        <div className=''>
                            <div>
                                <ComplatedList />
                            </div>
                            <div className='mt-3'>
                                <GeneralList />
                            </div>   
                        </div>
                    </div>


                </div>
            </div>

        </>
    )
}

export default ViewMilestone;

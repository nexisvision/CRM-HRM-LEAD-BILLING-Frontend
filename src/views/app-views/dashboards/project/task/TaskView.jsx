import React, { useState } from 'react';
import ComplatedList from './Complated/ComplatedList';
import IntroList from './List/IntroList';
import GeneralList from './General/GeneralList';



function TaskView() {
    return (
        <>
            <div className="">
                {/* <hr style={{ marginTop:"25px", border: '1px solid #e8e8e8' }} /> */}
                <div className="grid grid-cols-1 lg:grid-cols-2 mt-[30px]">
                    <div className='flex flex-col lg:flex-row gap-6'>
                        <div className=''>
                            <div>
                                <ComplatedList />
                            </div>
                            <div className='mt-3'>
                                <GeneralList />
                            </div>
                            {/* <ComplatedList />   
                            <IntroList /> */}
                        </div>
                        <div>
                            <IntroList />
                        </div>
                    </div>


                </div>
            </div>

        </>
    )
}

export default TaskView;

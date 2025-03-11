import React from 'react';

const ViewNotes = () => {
  return (
    <div className='bg-gray-50 ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4'>
      <div className=" p-4 rounded-md bg-white mt-4">
        <div className="gap-4">
          <div>
            <span className="font-semibold gap-4  ">Note Title:</span>
            <span className='ml-2 gap-2'>yhtgbv</span>
          </div>
          <div>
            <span className="font-semibold gap-4  ">Note Type:</span>
            <span className='ml-2 gap-2'>Public</span>
          </div>
          <div>
            <span className="font-semibold gap-4 ">Note Detail:</span>
            <span className='ml-2 gap-2'>e4rdf</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNotes;   
import React from 'react';
import ComplatedList from './Complated/ComplatedList';
import IntroList from './List/IntroList';
import GeneralList from './General/GeneralList';

function TaskView() {
  return (
    <div className="p-4 lg:p-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <ComplatedList />
          <GeneralList />
        </div>
        <div className="xl:col-span-1">
          <IntroList />
        </div>
      </div>
    </div>
  );
}

export default TaskView;
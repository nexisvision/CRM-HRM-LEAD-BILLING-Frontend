import React from 'react';

const ComplatedList = () => {
  return (
    <div className="bg-white shadow rounded-lg p-4 lg:p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody >
            <tr>
              <td className="py-3 text-gray-500 w-1/4 lg:w-1/5">Project</td>
              <td className="py-3 text-gray-700 hover:text-black transition-colors">
                Therapy and mental health support
              </td>
            </tr>

            <tr>
              <td className="py-3 text-gray-500">Priority</td>
              <td className="py-3 text-gray-700">Low</td>
            </tr>

            <tr>
              <td className="py-3 text-gray-500">Assigned To</td>
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://demo-saas.worksuite.biz/img/gravatar.png" 
                    alt="User" 
                    className="w-8 h-8 rounded-full border"
                  />
                  <div>
                    <p className="text-gray-700">Aletha Pagac</p>
                    <p className="text-sm text-gray-500">Junior</p>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td className="py-3 text-gray-500">Short Code</td>
              <td className="py-3 text-gray-700">TAMHS-3</td>
            </tr>

            <tr>
              <td className="py-3 text-gray-500">Milestones</td>
              <td className="py-3 text-gray-700">--</td>
            </tr>

            <tr>
              <td className="py-3 text-gray-500">Label</td>
              <td className="py-3 text-gray-700">--</td>
            </tr>

            <tr>
              <td className="py-3 text-gray-500">Task category</td>
              <td className="py-3 text-gray-700">--</td>
            </tr>

            <tr>
              <td className="py-3 text-gray-500">Description</td>
              <td className="py-3 text-gray-700 whitespace-pre-wrap">
                I to get through the doorway; 'and even if I shall never get to the little door into that beautiful garden--how IS that to be almost out of the Mock Turtle interrupted, 'if you don't like them raw.'.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplatedList;

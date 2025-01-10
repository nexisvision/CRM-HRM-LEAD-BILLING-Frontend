import React, { useState } from "react";
import { Form, Input, Button, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

const modules = [
  {
    name: 'Staff',
    modual: [
      { name: 'User', checked: false },
      { name: 'Role', checked: false },
      { name: 'Client', checked: false },
      { name: 'Permission', checked: false },
      { name: 'Product & service', checked: false },
      { name: 'Constant tax', checked: false },
      { name: 'Zoom meeting', checked: false },
    ],
    permissions: [
      { name: 'Manage', checked: false },
      { name: 'Create', checked: false }, 
      { name: 'Edit', checked: false },
      { name: 'Delete', checked: false },
    ],
  },
  {
    name: 'CRM',
    modual: [
      { name: 'Lead', checked: false },
      { name: 'Crm dashboard', checked: false },
      { name: 'Pipeline', checked: false },
      { name: 'Lead stage', checked: false },
      { name: 'Source', checked: false },
      { name: 'Label', checked: false },
      { name: 'Deal', checked: false },
      { name: 'Stage', checked: false },
      { name: 'Task', checked: false },
      { name: 'Contract', checked: false },
    ],
    permissions: [
      { name: 'Manage', checked: false },
      { name: 'Create', checked: false },
      { name: 'Edit', checked: false },
      { name: 'Delete', checked: false },
    ],
  },
  {
    name: 'Project',
    modual: [
      { name: 'Project dashboard', checked: false },
      { name: 'Project', checked: false },
      { name: 'Milestone', checked: false },
      { name: 'Grant chart', checked: false },
      { name: 'Project stage', checked: false },
      { name: 'Timesheet', checked: false },
      { name: 'Project task', checked: false },
      { name: 'Activity', checked: false },
      { name: 'CRM activity', checked: false },
      { name: 'Project task stage', checked: false },
      { name: 'Bug report', checked: false },
      { name: 'Bug status', checked: false },
    ],
    permissions: [
      { name: 'Manage', checked: false },
      { name: 'Create', checked: false },
      { name: 'Edit', checked: false },
      { name: 'Delete', checked: false },
    ],
  },
  {
    name: 'HRM',
    modual: [
      { name: 'Hrm dashboard', checked: false },
      { name: 'Employee', checked: false },
      { name: 'Employee profile', checked: false },
      { name: 'Department', checked: false },
      { name: 'Designation', checked: false },
      { name: 'Branch', checked: false },
      { name: 'Document type', checked: false },
      { name: 'Document', checked: false },
      { name: 'Allowance', checked: false },
      { name: 'Commission', checked: false },
      { name: 'Allowance option', checked: false },
      { name: 'Loan option', checked: false },
      { name: 'Loan', checked: false },
      { name: 'Overtime', checked: false },
      { name: 'Set salary', checked: false },

    ],
    permissions: [
      { name: 'Manage', checked: false },
      { name: 'Create', checked: false },
      { name: 'Edit', checked: false },
      { name: 'Delete', checked: false },
    ],
  },
  {
    name: 'ACCOUNT',
    modual: [
      { name: 'Account dashboard', checked: false },
      { name: 'Proposal', checked: false },
      { name: 'Invoice', checked: false },
      { name: 'Bill', checked: false },
      { name: 'Revenue', checked: false },
      { name: 'Payment', checked: false },
      { name: 'Proposal product', checked: false },
      { name: 'Goal', checked: false },
      { name: 'Credit note', checked: false },
      { name: 'Debit note', checked: false },
      { name: 'Bank account', checked: false },
      { name: 'Transaction', checked: false },
      { name: 'Customer', checked: false },
      { name: 'Vender', checked: false },
      { name: 'Constant custom field', checked: false },
      { name: 'Assets', checked: false },
      { name: 'Report', checked: false },
    ],
    permissions: [
      { name: 'Manage', checked: false },
      { name: 'Create', checked: false },
      { name: 'Edit', checked: false },
      { name: 'Delete', checked: false },
    ],
  },
  {
    name: 'POS',
    modual: [
      { name: 'Warehouse', checked: false },
      { name: 'Quotation', checked: false },
      { name: 'Purchase', checked: false },
      { name: 'Pos', checked: false },
      { name: 'Barcode', checked: false },
    ],
    permissions: [
      { name: 'Manage', checked: false },
      { name: 'Create', checked: false },
      { name: 'Edit', checked: false },
      { name: 'Delete', checked: false },
    ],
  },
];

const AddRole = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState(modules[0]); // Default to first module
  const [modulePermissions, setModulePermissions] = useState({});

  const handleModuleChange = (module) => {
    setSelectedModule(module);
  };

  const toggleAll = (checked) => {
    // Toggle all modules and permissions for the selected module
    const updatedModules = selectedModule.modual.map((mod) => ({
      ...mod,
      checked,
    }));
    const updatedPermissions = selectedModule.permissions.map((perm) => ({
      ...perm,
      checked,
    }));

    setSelectedModule({
      ...selectedModule,
      modual: updatedModules,
      permissions: updatedPermissions,
    });
  };

  const togglePermission = (moduleName, permissionName) => {
    setModulePermissions(prev => ({
      ...prev,
      [moduleName]: {
        ...prev[moduleName],
        [permissionName]: !prev?.[moduleName]?.[permissionName]
      }
    }));
  };

  // const isPermissionChecked = (moduleName, permissionName) => {
  //   return modulePermissions?.[moduleName]?.[permissionName] || false;
  // };

  // const togglePermission = (permission) => {
  //   const updatedPermissions = selectedModule.permissions.map((perm) =>
  //     perm.name === permission.name ? { ...perm, checked: !perm.checked } : perm
  //   );
  //   setSelectedModule({ ...selectedModule, permissions: updatedPermissions });
  // };

  // const toggleModule = (module) => {
  //   const updatedModules = selectedModule.modual.map((mod) =>
  //     mod.name === module.name ? { ...mod, checked: !mod.checked } : mod
  //   );
  //   setSelectedModule({ ...selectedModule, modual: updatedModules });
  // };


  const toggleModule = (module) => {
    // When module is checked/unchecked, update both module and its permissions
    const updatedModules = selectedModule.modual.map((mod) =>
      mod.name === module.name ? { ...mod, checked: !mod.checked } : mod
    );

    // If module is being checked, set all its permissions to checked
    const isChecking = !module.checked;
    const updatedPermissions = {
      ...modulePermissions,
      [module.name]: selectedModule.permissions.reduce((acc, permission) => {
        acc[permission.name] = isChecking;
        return acc;
      }, {})
    };

    setSelectedModule({ ...selectedModule, modual: updatedModules });
    setModulePermissions(updatedPermissions);
  };

  const isPermissionChecked = (moduleName, permissionName) => {
    return modulePermissions?.[moduleName]?.[permissionName] || false;
  };
  

  const onFinish = (values) => {
    console.log("Submitted values:", values);
    console.log("Selected module:", selectedModule);
    message.success("Role added successfully!");
    navigate("/app/hrm/role");
  };

  const areAllChecked = () => {
    return selectedModule.modual.every((mod) => mod.checked) &&
      Object.values(modulePermissions).every((modPerms) => 
        Object.values(modPerms).every((perm) => perm)
      );
  };

  

  const onFinishFailed = (errorInfo) => {
    console.error("Form submission failed:", errorInfo);
    message.error("Please fill out all required fields.");
  };

  return (
    <div className="add-employee">
      <Form
        layout="vertical"
        form={form}
        name="add-employee"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Role is required" }]}
            >
              <Input placeholder="Enter Role Name" />
            </Form.Item>
          </Col>
        </Row>

        <div className="container mx-auto p-4">
          <div className="flex space-x-2 mb-4">
            {modules.map((module) => (
              <button
                key={module.name}
                className={`text-gray-400 font-bold rounded-md px-4 py-2 ${selectedModule.name === module.name
                    ? "bg-blue-500 text-white"
                    : ""
                  }`}
                onClick={() => handleModuleChange(module)}
              >
                {module.name}
              </button>
            ))}
          </div>

          <table className="min-w-full table-auto border">
            <thead>
              <tr>
                <th className="px-4 py-2 border-r-2">
                  <input
                    type="checkbox"
                    onChange={(e) => toggleAll(e.target.checked)}
                    checked={
                      selectedModule.modual.every((mod) => mod.checked) &&
                      selectedModule.permissions.every((perm) => perm.checked)
                    }
                  />
                  <span className="ms-2">Module</span>
                </th>
                <th className="px-4 py-2">Permissions</th>
              </tr>
            </thead>
            <tbody>
          {selectedModule.modual.map((mod) => (
            <tr key={mod.name}>
              <td className="border px-4 py-2">
              <input
                      type="checkbox"
                      checked={mod.checked}
                      onChange={() => toggleModule(mod)}
                    />
                <span className="ms-2">{mod.name}</span>
              </td>
              <td className="border px-4 py-2 flex space-x-4">
                {selectedModule.permissions.map((permission) => (
                  <div key={permission.name} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={isPermissionChecked(mod.name, permission.name)}
                      onChange={() => togglePermission(mod.name, permission.name)}
                    />
                    <span>{permission.name}</span>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
          </table>
        </div>

        <Form.Item>
          <div className="text-right">
            <Button
              type="default"
              className="mr-2"
              onClick={() => navigate("/app/hrm/employee")}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddRole;

// import React, { useState } from "react";

// const AddRole = () => {
//   const [modules, setModules] = useState([
//     {
//       name: "User Management",
//       modual: [
//         {
//           name: "User",
//           permissions: [
//             { name: "View", checked: false },
//             { name: "Manage", checked: false },
//           ],
//         },
//         {
//           name: "Admin",
//           permissions: [
//             { name: "View", checked: false },
//             { name: "Manage", checked: false },
//           ],
//         },
//       ],
//     },
//     {
//       name: "Project Management",
//       modual: [
//         {
//           name: "Projects",
//           permissions: [
//             { name: "View", checked: false },
//             { name: "Manage", checked: false },
//           ],
//         },
//         {
//           name: "Tasks",
//           permissions: [
//             { name: "View", checked: false },
//             { name: "Manage", checked: false },
//           ],
//         },
//       ],
//     },
//   ]);

//   const [selectedModule, setSelectedModule] = useState(modules[0]);

//   const selectModule = (moduleName) => {
//     const selected = modules.find((mod) => mod.name === moduleName);
//     setSelectedModule(selected);
//   };

//   const togglePermission = (moduleName, permissionName) => {
//     const updatedModules = modules.map((module) => {
//       if (module.name === selectedModule.name) {
//         return {
//           ...module,
//           modual: module.modual.map((mod) =>
//             mod.name === moduleName
//               ? {
//                   ...mod,
//                   permissions: mod.permissions.map((perm) =>
//                     perm.name === permissionName
//                       ? { ...perm, checked: !perm.checked }
//                       : perm
//                   ),
//                 }
//               : mod
//           ),
//         };
//       }
//       return module;
//     });

//     setModules(updatedModules);
//     setSelectedModule(updatedModules.find((mod) => mod.name === selectedModule.name));
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Add Role</h1>

//       {/* Module Selection Dropdown */}
//       <div className="mb-4">
//         <label className="block mb-2 font-semibold">Select Module:</label>
//         <select
//           className="border border-gray-300 rounded p-2"
//           value={selectedModule.name}
//           onChange={(e) => selectModule(e.target.value)}
//         >
//           {modules.map((module) => (
//             <option key={module.name} value={module.name}>
//               {module.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Permissions Section */}
//       <div>
//         <h2 className="text-xl font-semibold mb-2">Permissions for {selectedModule.name}</h2>
//         {selectedModule.modual.map((mod) => (
//           <div key={mod.name} className="mb-4">
//             <h3 className="font-bold mb-2">{mod.name}</h3>
//             <div className="flex items-center space-x-4">
//               {mod.permissions.map((perm) => (
//                 <label key={perm.name} className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={perm.checked}
//                     onChange={() => togglePermission(mod.name, perm.name)}
//                   />
//                   <span>{perm.name}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AddRole;


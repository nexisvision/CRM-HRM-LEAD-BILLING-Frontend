import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editRole, getRoles } from '../RoleAndPermissionReducers/RoleAndPermissionSlice';

const EditRole = ({ id,onClose }) => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const alldept = useSelector((state) => state.role);

  const modules = [
    {
      name: "Staff",
      modual: [
        { name: "User", checked: false },
        { name: "Role", checked: false },
        { name: "Client", checked: false },
        { name: "Permission", checked: false },
        { name: "Product & service", checked: false },
        { name: "Constant tax", checked: false },
        { name: "Zoom meeting", checked: false },
      ],
      permissions: [
        { name: "Manage", checked: false },
        { name: "Create", checked: false },
        { name: "Edit", checked: false },
        { name: "Delete", checked: false },
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
          { name: 'Project Overview', checked: false },
          { name: 'Project', checked: false },
          { name: 'Milestone', checked: false },
          { name: 'Project stage', checked: false },
          { name: 'Project task', checked: false },
          { name: 'Activity', checked: false },
          { name: 'CRM activity', checked: false },
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
          { name: 'Employee', checked: false },
          { name: 'Department', checked: false },
          { name: 'Designation', checked: false },
          { name: 'Branch', checked: false },
          { name: 'Document', checked: false },
          { name: 'Allowance', checked: false },
          { name: 'Commission', checked: false },
          { name: 'Loan', checked: false },
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
        name: 'Sales',
        modual: [
          { name: 'Proposal', checked: false },
          { name: 'Invoice', checked: false },
          { name: 'Bill', checked: false },
          { name: 'Revenue', checked: false },
          { name: 'Payment', checked: false },
          { name: 'Product', checked: false },
          { name: 'Credit note', checked: false },
          { name: 'Customer', checked: false },
        ],
        permissions: [
          { name: 'Manage', checked: false },
          { name: 'Create', checked: false },
          { name: 'Edit', checked: false },
          { name: 'Delete', checked: false },
        ],
      },
    // Add other modules similarly...
  ];

  const [selectedModule, setSelectedModule] = useState(modules[0]);
  const [moduleStates, setModuleStates] = useState({});
  const [modulePermissions, setModulePermissions] = useState({});
  const [singleEmp, setSingleEmp] = useState(null);

  useEffect(() => {
    if (roleId && alldept?.role?.data) {
      const role = alldept.role.data.find((item) => item.id === roleId);
      if (role) {
        setSingleEmp(role);
        form.setFieldsValue({
          role_name: role.role_name,
          permissions: role.permissions,
        });
      }
    }
  }, [roleId, alldept, form]);

  useEffect(() => {
    if (singleEmp?.permissions) {
      const newModuleStates = {};
      const newModulePermissions = {};

      modules.forEach((module) => {
        const modulePermissions = singleEmp.permissions[module.name.toLowerCase()] || {};
        newModuleStates[module.name] = {
          ...module,
          modual: module.modual.map((mod) => ({
            ...mod,
            checked: !!modulePermissions[mod.name.toLowerCase()]?.checked,
          })),
        };

        newModulePermissions[module.name] = modulePermissions;
      });

      setModuleStates(newModuleStates);
      setModulePermissions(newModulePermissions);
      setSelectedModule(modules[0]);
    }
  }, [singleEmp]);

  const handleModuleChange = (module) => {
    if (form) {
      form.validateFields().then(() => {
        saveModuleState(selectedModule.name);
        setSelectedModule(module);
        loadModuleState(module.name);
      }).catch((error) => {
        saveModuleState(selectedModule.name);
        setSelectedModule(module);
        loadModuleState(module.name);
      });
    }
  };

  const saveModuleState = (moduleName) => {
    setModuleStates((prev) => ({
      ...prev,
      [moduleName]: selectedModule,
    }));
  };

  const loadModuleState = (moduleName) => {
    const savedState = moduleStates[moduleName];
    if (savedState) {
      setSelectedModule(savedState);
    }
  };

  const toggleAll = (checked) => {
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

  const toggleModule = (module) => {
    const updatedModules = selectedModule.modual.map((mod) =>
      mod.name === module.name ? { ...mod, checked: !mod.checked } : mod
    );
    const isChecking = !module.checked;

    const updatedPermissions = selectedModule.permissions.reduce(
      (acc, permission) => ({
        ...acc,
        [permission.name.toLowerCase()]: isChecking,
      }),
      {}
    );

    setSelectedModule({
      ...selectedModule,
      modual: updatedModules,
    });

    setModulePermissions((prev) => ({
      ...prev,
      [module.name]: updatedPermissions,
    }));
  };

  const isPermissionChecked = (moduleName, permissionName) => {
    return modulePermissions?.[moduleName]?.[permissionName] || false;
  };

  const togglePermission = (moduleName, permissionName) => {
    setModulePermissions((prev) => ({
      ...prev,
      [moduleName]: {
        ...prev[moduleName],
        [permissionName]: !prev?.[moduleName]?.[permissionName],
      },
    }));
  };
  const onFinish = (values) => {
    const generatePayload = () => {
      const payload = {
        role_name: form.getFieldValue("role_name"),
        permissions: {},
      };
  
      modules.forEach((moduleTemplate) => {
        const moduleState = moduleStates[moduleTemplate.name] || moduleTemplate;
        const selectedSubmodules = moduleState.modual.filter((mod) => mod.checked);

        selectedSubmodules.forEach((submodule) => {
          moduleTemplate.permissions.forEach((permission) => {
            const permissionKey = permission.name.toLowerCase();
            const isChecked = modulePermissions[submodule.name]?.[permissionKey] || false;

            if (isChecked) {
              payload.permissions[moduleTemplate.name.toLowerCase()] = {
                ...payload.permissions[moduleTemplate.name.toLowerCase()],
                [submodule.name.toLowerCase().replace(/\s+/g, "_")]: {
                  ...payload.permissions[moduleTemplate.name.toLowerCase()]
                    [submodule.name.toLowerCase().replace(/\s+/g, "_")],
                  [permissionKey]: isChecked,
                },
              };
            }
          });
        });
      });   
  
      return payload;
    };
  
    const payload = generatePayload();
  
    if (!payload.permissions.length) {
      message.error("No permissions selected for the role!");
      return;
    }
  
    console.log("Final Payload:", payload);
  
    dispatch(editRole({ id, payload }))
      .then(() => {
        dispatch(getRoles());
        message.success("Role edited successfully!");
        navigate("/app/hrm/role");
      })
      .catch((error) => {
        message.error("Failed to edit role.");
        console.error("Edit API error:", error);
      });
  };

  return (
    <div className="edit-role">
      <Form layout="vertical" form={form} name="edit-role" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="role_name"
              label="Role"
              rules={[{ required: true, message: "Role is required" }]}
            >
              <Input placeholder="Enter Role Name" />
            </Form.Item>
          </Col>
        </Row>

        {selectedModule && (
          <div className="container mx-auto p-4">
            <div className="flex space-x-2 mb-4">
              {modules.map((module) => (
                <button
                  key={module.name}
                  type="button"
                  className={`text-gray-400 font-bold rounded-md px-4 py-2 ${
                    selectedModule.name === module.name ? "bg-blue-500 text-white" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleModuleChange(module);
                  }}
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
        )}

        <Form.Item>
          <div className="text-right">
            <Button
              type="default"
              className="mr-2"
              onClick={() => navigate("/app/hrm/role")}
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

export default EditRole;








// import React, { useState, useEffect } from 'react';
// import { Form, Input, Button, Row, Col, message } from 'antd';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { editRole, getRoles } from '../RoleAndPermissionReducers/RoleAndPermissionSlice';

// const EditRole = ({ id, onClose }) => {
//   const { roleId } = useParams(); // Assuming you are passing roleId in the route params
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   const [form] = Form.useForm();
//   const [selectedModule, setSelectedModule] = useState(null);
//   const [moduleStates, setModuleStates] = useState({});
//   const [modulePermissions, setModulePermissions] = useState({});
//   const alldept = useSelector((state) => state.role);

// //   const role = useSelector((state) => 
// //     state.roleAndPermission.roles.find((role) => role.id === roleId)
// //   );

//   // Define the modules constant (same as before)
//   const modules = [
//     {
//       name: 'Staff',
//       modual: [
//         { name: 'User', checked: false },
//         { name: 'Role', checked: false },
//         { name: 'Client', checked: false },
//         { name: 'Permission', checked: false },
//         { name: 'Product & service', checked: false },
//         { name: 'Constant tax', checked: false },
//         { name: 'Zoom meeting', checked: false },
//       ],
//       permissions: [
//         { name: 'Manage', checked: false },
//         { name: 'Create', checked: false },
//         { name: 'Edit', checked: false },
//         { name: 'Delete', checked: false },
//       ],
//     },
//     // Include other modules similarly...
//   ];


// const [singleEmp, setSingleEmp] = useState(null);

// useEffect(() => {
//     if (id && alldept?.role?.data) {
//       const role = alldept.role.data.find((item) => item.id === id);
//       if (role) {
//         setSingleEmp(role);
//         form.setFieldsValue({
//           role_name: role.role_name,
//           permissions: role.permissions,
//         });
//       }
//     }
//   }, [id, alldept, form]);  


//   useEffect(() => {
//     if (singleEmp?.permissions) {
//       const newModuleStates = {};
//       const newModulePermissions = {};
  
//       modules.forEach((module) => {
//         const modulePermissions = singleEmp.permissions[module.name.toLowerCase()] || {};
//         newModuleStates[module.name] = {
//           ...module,
//           modual: module.modual.map((mod) => ({
//             ...mod,
//             checked: !!modulePermissions[mod.name.toLowerCase()]?.checked,
//           })),
//         };
  
//         newModulePermissions[module.name] = modulePermissions;
//       });
  
//       setModuleStates(newModuleStates);
//       setModulePermissions(newModulePermissions);
//       setSelectedModule(modules[0]);
//     }
//   }, [singleEmp, modules]);



//   const handleModuleChange = (module) => {
//     saveModuleState(selectedModule.name); // Save current module state
//     setSelectedModule(module);
//     loadModuleState(module.name); // Load the state of the new module
//   };

//   const saveModuleState = (moduleName) => {
//     setModuleStates((prev) => ({
//       ...prev,
//       [moduleName]: selectedModule,
//     }));
//   };

//   const loadModuleState = (moduleName) => {
//     const savedState = moduleStates[moduleName];
//     if (savedState) {
//       setSelectedModule(savedState);
//     }
//   };

//   const toggleAll = (checked) => {
//     const updatedModules = selectedModule.modual.map((mod) => ({
//       ...mod,
//       checked,
//     }));
//     const updatedPermissions = selectedModule.permissions.map((perm) => ({
//       ...perm,
//       checked,
//     }));
//     setSelectedModule({
//       ...selectedModule,
//       modual: updatedModules,
//       permissions: updatedPermissions,
//     });
//   };

//   const toggleModule = (module) => {
//     const updatedModules = selectedModule.modual.map((mod) =>
//       mod.name === module.name ? { ...mod, checked: !mod.checked } : mod
//     );
//     const isChecking = !module.checked;

//     // Initialize all permissions for this module when checked
//     const updatedPermissions = selectedModule.permissions.reduce((acc, permission) => ({
//       ...acc,
//       [permission.name.toLowerCase()]: isChecking,
//     }), {});

//     setSelectedModule({
//       ...selectedModule,
//       modual: updatedModules,
//     });

//     setModulePermissions((prev) => ({
//       ...prev,
//       [module.name]: updatedPermissions,
//     }));
//   };

//   const isPermissionChecked = (moduleName, permissionName) => {
//     return modulePermissions?.[moduleName]?.[permissionName] || false;
//   };

//   const togglePermission = (moduleName, permissionName) => {
//     setModulePermissions((prev) => ({
//       ...prev,
//       [moduleName]: {
//         ...prev[moduleName],
//         [permissionName]: !prev?.[moduleName]?.[permissionName],
//       },
//     }));
//   };

//   const onFinish = (values) => {
//     const generatePayload = () => {
//   const payload = {
//     role_name: form.getFieldValue('role_name'),
//     permissions: {},
//   };

//   modules.forEach((moduleTemplate) => {
//     const moduleState = moduleStates[moduleTemplate.name] || moduleTemplate;
//     const selectedSubmodules = moduleState.modual.filter((mod) => mod.checked);

//     if (selectedSubmodules.length > 0) {
//       const moduleKey = moduleTemplate.name.toLowerCase();
//       payload.permissions[moduleKey] = {};

//       selectedSubmodules.forEach((submodule) => {
//         const submoduleKey = submodule.name.toLowerCase().replace(/\s+/g, "_");
//         payload.permissions[moduleKey][submoduleKey] = {};

//         moduleTemplate.permissions.forEach((permission) => {
//           const permissionKey = permission.name.toLowerCase();
//           const isChecked = modulePermissions[submodule.name]?.[permissionKey] || false;
//           payload.permissions[moduleKey][submoduleKey][permissionKey] = isChecked;
//         });
//       });
//     }
//   });

//   return payload;
// };

//     const payload = generatePayload();

//     if (!payload) return;

//     console.log("Final Payload:", payload);
//     dispatch(editRole({ id, payload })) // Assuming `editRole` action exists
//       .then(() => {
//         dispatch(getRoles());
//         message.success('Role edited successfully!');
//         onClose(); // Optional if provided
//         navigate("/app/hrm/role");
//       })
//       .catch((error) => {
//         message.error('Failed to edit role.');
//         console.error('Edit API error:', error);
//       });
//   };

//   return (
//     <div className="edit-role">
//       <Form
//         layout="vertical"
//         form={form}
//         name="edit-role"
//         onFinish={onFinish}
//       >
//         <Row gutter={16}>
//           <Col span={24}>
//             <Form.Item
//               name="role"
//               label="Role"
//               rules={[{ required: true, message: "Role is required" }]}
//             >
//               <Input placeholder="Enter Role Name" />
//             </Form.Item>
//           </Col>
//         </Row>

//         {/* Module Selection */}
//         <div className="container mx-auto p-4">
//           <div className="flex space-x-2 mb-4">
//             {modules.map((module) => (
//               <button
//                 key={module.name}
//                 className={`text-gray-400 font-bold rounded-md px-4 py-2 ${selectedModule.name === module.name
//                   ? "bg-blue-500 text-white"
//                   : ""
//                 }`}
//                 onClick={() => handleModuleChange(module)}
//               >
//                 {module.name}
//               </button>
//             ))}
//           </div>

//           {/* Module and Permission Table */}
//           <table className="min-w-full table-auto border">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2 border-r-2">
//                   <input
//                     type="checkbox"
//                     onChange={(e) => toggleAll(e.target.checked)}
//                     checked={
//                       selectedModule.modual.every((mod) => mod.checked) &&
//                       selectedModule.permissions.every((perm) => perm.checked)
//                     }
//                   />
//                   <span className="ms-2">Module</span>
//                 </th>
//                 <th className="px-4 py-2">Permissions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedModule.modual.map((mod) => (
//                 <tr key={mod.name}>
//                   <td className="border px-4 py-2">
//                     <input
//                       type="checkbox"
//                       checked={mod.checked}
//                       onChange={() => toggleModule(mod)}
//                     />
//                     <span className="ms-2">{mod.name}</span>
//                   </td>
//                   <td className="border px-4 py-2 flex space-x-4">
//                     {selectedModule.permissions.map((permission) => (
//                       <div key={permission.name} className="flex items-center">
//                         <input
//                           type="checkbox"
//                           className="mr-2"
//                           checked={isPermissionChecked(mod.name, permission.name)}
//                           onChange={() => togglePermission(mod.name, permission.name)}
//                         />
//                         <span>{permission.name}</span>
//                       </div>
//                     ))}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Submit Buttons */}
//         <Form.Item>
//           <div className="text-right">
//             <Button
//               type="default"
//               className="mr-2"
//               onClick={() => navigate("/app/hrm/role")}
//             >
//               Cancel
//             </Button>
//             <Button type="primary" htmlType="submit">
//               Submit
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default EditRole;

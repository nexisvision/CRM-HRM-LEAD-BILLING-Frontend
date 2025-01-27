import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Checkbox } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editRole, getRoles } from '../RoleAndPermissionReducers/RoleAndPermissionSlice';

const EditRole = ({ id, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const alldept = useSelector((state) => state.role);
  const [activeTab, setActiveTab] = useState('Staff');
  const [modulePermissions, setModulePermissions] = useState({});
  const [singleEmp, setSingleEmp] = useState(null);


  const role = alldept?.role?.data?.find((item) => item.id === id);


  const modules = [
    'Staff',
    'CRM',
    'Project',
    'HRM',
    'Account',
    'POS'
  ];

  const subModules = {
    Staff: [
      'User',
      'Role',
      'Client',
      'Product & service',
      'Constant unit',
      'Constant tax',
      'Constant category',
      'Zoom meeting',
      'Company settings',
      'Permission'
    ],
    CRM: [
      'Lead',
      'Pipeline',
      'Deal',
      'Task',
      'Contract'
    ],
    Project: [
      'Project',
      'Milestone',
      'Task',
      'Activity'
    ],
    HRM: [
      'Employee',
      'Department',
      'Designation',
      'Document Type',
      'Payroll'
    ],
    Account: [
      'Invoice',
      'Bill',
      'Payment',
      'Tax'
    ],
    POS: [
      'Product',
      'Category',
      'Order',
      'Transaction'
    ]
  };
  const permissions = ['Manage', 'Create', 'Edit', 'Delete'];

  useEffect(() => {
    if (id && alldept?.role?.data) {
      if (role) {
        setSingleEmp(role);
        form.setFieldsValue({
          role_name: role.role_name,
        });
        setModulePermissions(role.permissions);
      }
    }
  }, [id, alldept, form]);


  useEffect(() => {
    if (singleEmp?.permissions) {
      const initialPermissions = {};
      modules.forEach(module => {
        if (singleEmp.permissions[module.toLowerCase()]) {
          Object.keys(singleEmp.permissions[module.toLowerCase()]).forEach(subModule => {
            initialPermissions[subModule.replace(/_/g, ' ')] = singleEmp.permissions[module.toLowerCase()][subModule];
          });
        }
      });
      setModulePermissions(initialPermissions);
    }
  }, [singleEmp]);

  // Handle module tab click
  const handleModuleClick = (moduleName) => {
    setActiveTab(moduleName);
  };

  // Handle select all for entire module
  const handleSelectAllModule = (checked) => {
    const newPermissions = { ...modulePermissions };
    subModules[activeTab].forEach(submodule => {
      newPermissions[submodule] = {};
      permissions.forEach(permission => {
        newPermissions[submodule][permission] = checked;
      });
    });
    setModulePermissions(newPermissions);
  };
  // Check if all permissions in the current module are selected
  const isAllModuleSelected = () => {
    return subModules[activeTab].every(submodule =>
      permissions.every(perm => modulePermissions[submodule]?.[perm])
    );
  };


  // Handle select all permissions for a submodule
  const handleSelectAllSubmodule = (submodule) => {
    setModulePermissions(prev => {
      const currentPermissions = prev[submodule] || {};
      const allSelected = permissions.every(perm => currentPermissions[perm]);

      const newPermissions = {};
      permissions.forEach(perm => {
        newPermissions[perm] = !allSelected;
      });

      return {
        ...prev,
        [submodule]: newPermissions
      };
    });
  };

  // Handle individual permission toggle
  const handlePermissionToggle = (submodule, permission) => {
    setModulePermissions(prev => ({
      ...prev,
      [submodule]: {
        ...(prev[submodule] || {}),
        [permission]: !(prev[submodule]?.[permission] || false)
      }
    }));
  };

  // Check if all permissions are selected for a submodule
  const isAllSelected = (submodule) => {
    return permissions.every(perm => modulePermissions[submodule]?.[perm]);
  };


  const onFinish = (values) => {
    const payload = {
      role_name: values.role_name,
      permissions: {}
    };
    Object.entries(modulePermissions).forEach(([submodule, perms]) => {
      const moduleKey = activeTab.toLowerCase();
      if (!payload.permissions[moduleKey]) {
        payload.permissions[moduleKey] = {};
      }
      payload.permissions[moduleKey][submodule.toLowerCase().replace(/\s+/g, '_')] = perms;
    });
    dispatch(editRole({ id, payload }))
      .then(() => {
        dispatch(getRoles());
        message.success('Role edited successfully!');
        onClose();
        navigate("/app/hrm/role");
      })
      .catch((error) => {
        message.error('Failed to edit role.');
        console.error("Edit API error:", error);
      });
  };

  return (
    <div className="p-4">
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="role_name"
          label="Role Name"
          rules={[{ required: true, message: 'Please enter role name' }]}
        >
          <Input placeholder="Enter Role Name" />
        </Form.Item>
        <div className="mb-4 flex space-x-2">
          {modules.map(module => (
            <Button
              key={module}
              type={activeTab === module ? 'primary' : 'default'}
              onClick={() => handleModuleClick(module)}
              style={{
                backgroundColor: activeTab === module ? '#1890ff' : 'white',
                color: activeTab === module ? 'white' : 'rgba(0, 0, 0, 0.65)'
              }}
            >
              {module}
            </Button>
          ))}
        </div>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-50">
              <th className="border py-2 gap-2 flex space-x-4 items-center">
                {activeTab && (
                  <Checkbox
                    className="ml-2"
                    checked={isAllModuleSelected()}
                    onChange={(e) => handleSelectAllModule(e.target.checked)}
                  />
                )}
                MODULE
              </th>
              <th className="border p-2">PERMISSIONS</th>
            </tr>
          </thead>
          <tbody>
            {subModules[activeTab].map(submodule => (
              <tr key={submodule} className="hover:bg-gray-50">
                <td className="border p-2">
                  <Checkbox
                    checked={isAllSelected(submodule)}
                    onChange={() => handleSelectAllSubmodule(submodule)}
                  >
                    {submodule}
                  </Checkbox>
                </td>
                <td className="border p-2">
                  <div className="flex space-x-4">
                    {permissions.map(permission => (
                      <Checkbox
                        key={`${submodule}-${permission}`}
                        checked={modulePermissions[submodule]?.[permission] || false}
                        onChange={() => handlePermissionToggle(submodule, permission)}
                      >
                        {permission}
                      </Checkbox>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-4 space-x-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">Save</Button>
        </div>
      </Form>
    </div>
  );
};

export default EditRole;
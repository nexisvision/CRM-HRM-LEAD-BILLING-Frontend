import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editRole, getRoles, roledata } from '../RoleAndPermissionReducers/RoleAndPermissionSlice';

const EditRole = ({ id, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const alldept = useSelector((state) => state.role);
  const [activeTab, setActiveTab] = useState('Staff');
  const [modulePermissions, setModulePermissions] = useState({});
  const [singleEmp, setSingleEmp] = useState(null);

  const role = alldept?.role?.data?.find((item) => item.id === id);

  const modules = React.useMemo(() => [
    'Staff',
    'CRM',
    'Project',
    'HRM',
    'Account',
  ], []);

  const subModules = {
    CRM: [
      { key: 'dashboards-leadcards', title: 'LeadCards' },
      { key: 'dashboards-lead', title: 'Leads' },
      { key: 'dashboards-deal', title: 'Deals' },
      { key: 'dashboards-proposal', title: 'Proposal' },
      { key: 'dashboards-task', title: 'Task' },
      { key: 'dashboards-TaskCalendar', title: 'Task Calendar' },
      { key: 'dashboards-systemsetup', title: 'CRM System Setup' },
      { key: 'dashboards-mail', title: 'Mail' },
      { key: 'dashboards-chat', title: 'Chat' },
      { key: 'dashboards-calendar', title: 'Calendar' },
      { key: 'extra-pages-customersupports-ticket', title: 'Ticket Supports' },
    ],
    Staff: [
      { key: 'extra-users-list', title: 'Users' },
      { key: 'extra-users-client-list', title: 'Clients' },
    ],
    Project: [
      { key: 'dashboards-project-list', title: 'Project' },
      { key: 'dashboards-project-Contract', title: 'Contract' },
    ],
    HRM: [
      { key: 'extra-hrm-employee', title: 'Employee' },
      { key: 'extra-hrm-payroll-salary', title: 'Salary' },
      { key: 'extra-hrm-performance-indicator', title: 'Indicator' },
      { key: 'extra-hrm-performance-appraisal', title: 'Appraisal' },
      { key: 'extra-hrm-role', title: 'Role' },
      { key: 'extra-hrm-designation', title: 'Designation' },
      { key: 'extra-hrm-department', title: 'Department' },
      { key: 'extra-hrm-branch', title: 'Branch' },
      { key: 'extra-hrm-attendance-attendancelist', title: 'Attendance' },
      { key: 'extra-hrm-leave-leavelist', title: 'Leave Management' },
      { key: 'extra-hrm-meeting', title: 'Meeting' },
      { key: 'extra-hrm-announcement', title: 'Announcement' },
      { key: 'extra-hrm-jobs-joblist', title: 'Job' },
      { key: 'extra-hrm-jobs-jobcandidate', title: 'Job Candidate' },
      { key: 'extra-hrm-jobs-jobonbording', title: 'Job On-Bording' },
      { key: 'extra-hrm-jobs-jobapplication', title: 'Job Application' },
      { key: 'extra-hrm-jobs-jobofferletter', title: 'Job Offer Letter' },
      { key: 'extra-hrm-jobs-interview', title: 'Job Interviews' },
      { key: 'extra-hrm-document', title: 'Document' },
      { key: 'extra-hrm-trainingSetup', title: 'TrainingSetup' }
    ],
    Account: [
      { key: 'dashboards-sales-customer', title: 'Customer' },
      { key: 'dashboards-sales-invoice', title: 'Invoice' },
      { key: 'dashboards-sales-billing', title: 'Billing' },
      { key: 'dashboards-sales-revenue', title: 'Revenue' },
      { key: 'dashboards-sales-estimates', title: 'Estimates' },
      { key: 'dashboards-sales-creditnotes', title: 'Credit Notes' },
    ],
  };

  const permissions = ['view', 'create', 'update', 'delete'];

  useEffect(() => {
    dispatch(roledata())
  }, [dispatch])

  useEffect(() => {
    if (id && alldept?.role?.data) {
      if (role) {
        setSingleEmp(role);
        form.setFieldsValue({
          role_name: role.role_name,
        });

        const rolePermissions = role.permissions;
        // Set initial module permissions based on the existing role permissions
        const initialPermissions = {};
        console.log("Role permissions:", rolePermissions); // Log the role permissions for debugging

        // Iterate over the keys of role.permissions
        Object?.keys(rolePermissions)?.forEach(moduleKey => {
          const subModules = rolePermissions[moduleKey]; // Get the submodules for the current module key
          if (Array?.isArray(subModules)) { // Ensure it's an array
            subModules?.forEach(subModule => {
              // Check if subModule has a key and permissions
              if (subModule?.key && subModule?.permissions) {
                initialPermissions[subModule?.key] = {};
                subModule?.permissions?.forEach(permission => {
                  initialPermissions[subModule.key][permission] = true; // Set to true if permission exists
                });
              }
            });
          } else {
            console.warn(`Expected an array for moduleKey: ${moduleKey}, but got:`, subModules);
          }
        });
        console.log("initialPermissions", initialPermissions); // Log the initial permissions
        setModulePermissions(initialPermissions); // Set the permissions for the edit modal
      }
    }
  }, [id, alldept, form, role]);

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
  }, [singleEmp, modules]);

  const handleModuleClick = (moduleName) => {
    setActiveTab(moduleName);
  };

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
  const isAllModuleSelected = () => {
    return subModules[activeTab].every(submodule =>
      permissions.every(perm => modulePermissions[submodule]?.[perm])
    );
  };

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

    Object.entries(modulePermissions).forEach(([submoduleKey, perms]) => {
        const selectedPermissions = Object.entries(perms)
            .filter(([_, isSelected]) => isSelected)
            .map(([perm]) => perm.toLowerCase());

        if (selectedPermissions.length > 0) {
            const moduleName = activeTab; // Get active module
            if (!payload.permissions[moduleName]) {
                payload.permissions[moduleName] = []; 
            }
            payload.permissions[moduleName].push({
                key: submoduleKey,
                permissions: selectedPermissions
            });
        }
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
       <div className="mb-3 border-b pb-1 "></div>
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
              <tr key={submodule.key} className="hover:bg-gray-50">
                <td className="border p-2">
                  <Checkbox
                    checked={isAllSelected(submodule.key)}
                    onChange={() => handleSelectAllSubmodule(submodule.key)}
                  >
                    {submodule.title}
                  </Checkbox>
                </td>
                <td className="border p-2">
                  <div className="flex space-x-4">
                    {permissions.map(permission => (
                      <Checkbox
                        key={`${submodule.key}-${permission}`}
                        checked={modulePermissions[submodule.key]?.[permission] || false}
                        onChange={() => handlePermissionToggle(submodule.key, permission)}
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


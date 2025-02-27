import axios from "axios";
// const baseUrl = import.meta.env.VITE_BASE_URL;
// import { getToken } from "../../../configs/axiosConfig"

// const addUser = async (data) => {
//     const res = await axios.post(`${baseUrl}users/add`, data, getToken());
//     return res
// };

const getsal = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get("http://localhost:5353/api/v1/salary/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const addsal = async (payload) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.post(
      "http://localhost:5353/api/v1/salary/",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    //    dispatch(empdata());
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const deletsal = async (id) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.delete(
      `http://localhost:5353/api/v1/salary/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    //   dispatch(empdata());
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const editsal = async (idd, values) => {
  const token = localStorage.getItem("auth_token");
  try {
    // Make sure all required fields are included in the request
    const payload = {
      employeeId: values.employeeId,
      payslipType: values.payslipType,
      currency: values.currency,
      salary: values.salary,
      netSalary: values.netSalary,
      status: values.status,
      bankAccount: values.bankAccount,
      created_by: values.created_by
    };

    const res = await axios.put(
      `http://localhost:5353/api/v1/salary/${idd}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    if (res.data.success === false) {
      throw new Error(res.data.message);
    }

    return res.data;
  } catch (error) {
    console.error("Error updating salary data:", error);
    throw error;
  }
};

// const getAllUsers = async () => {
//     const res = await axios.get(`${baseUrl}users/all`, getToken());
//     return res.data
// }

// const getUserById = async (data) => {
//     const res = await axios.get(`${baseUrl}users/${data}`, getToken());
//     return res.data
// }

// const deleteUser = async (data) => {
//     const res = await axios.delete(`${baseUrl}users/${data}`, getToken());
//     return res.data
// }

// const updateUser = async (data) => {
//     const res = await axios.put(`${baseUrl}users/${data?.id}`, data?.data, getToken());
//     return res.data
// }

const UserService = {
  // addUser,
  getsal,
  addsal,
  deletsal,
  editsal,
  // getAllUsers,
  // getUserById,
  // deleteUser,
  // updateUser
};

export default UserService;

import axios from "axios";
import { env } from "configs/EnvironmentConfig";
// const baseUrl = import.meta.env.VITE_BASE_URL;
// import { getToken } from "../../../configs/axiosConfig"

// const addUser = async (data) => {
//     const res = await axios.post(`${baseUrl}users/add`, data, getToken());
//     return res
// };

const getjobapp = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(
      `${env.API_ENDPOINT_URL}/job-applications/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const addjobapp = async (payload) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/job-applications/`,
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

const deletejobapp = async (id) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.delete(
      `${env.API_ENDPOINT_URL}/job-applications/${id}`,
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

const editjobapp = async (idd, formData) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `${env.API_ENDPOINT_URL}/job-applications/${idd}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating employee data:", error);
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
  getjobapp,
  addjobapp,
  deletejobapp,
  editjobapp,
  // getAllUsers,
  // getUserById,
  // deleteUser,
  // updateUser
};

export default UserService;

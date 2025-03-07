import axios from "axios";
import { env } from "configs/EnvironmentConfig";
// const baseUrl = import.meta.env.VITE_BASE_URL;
// import { getToken } from "../../../configs/axiosConfig"

// const adddbillsssUser = async (data) => {
//     const res = await axios.post(`${baseUrl}users/adddbillsss`, data, getToken());
//     return res
// };

const getbillsss = async (lid) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(`${env.API_ENDPOINT_URL}/bills/${lid}`, {
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

const addbillsss = async (lid, invoiceData) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/bills/${lid}`,
      invoiceData,
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

const deltedbillsss = async (id) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.delete(`${env.API_ENDPOINT_URL}/bills/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //   dispatch(empdata());
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const editbillsss = async (idd, invoiceData) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `${env.API_ENDPOINT_URL}/bills/${idd}`,
      invoiceData,
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
  // adddbillsssUser,
  getbillsss,
  addbillsss,
  deltedbillsss,
  editbillsss,
  // getAllUsers,
  // getUserById,
  // deleteUser,
  // updateUser
};

export default UserService;

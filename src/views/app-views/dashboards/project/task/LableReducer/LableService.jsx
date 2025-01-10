import axios from "axios";
// const baseUrl = import.meta.env.VITE_BASE_URL;
// import { getToken } from "../../../configs/axiosConfig"

// const addUser = async (data) => {
//     const res = await axios.post(`${baseUrl}users/add`, data, getToken());
//     return res
// };

const GetLable = async (lid) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(`http://localhost:5353/api/v1/labels/${lid}`, {
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

const AddLable = async (lid, payload) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.post(
      `http://localhost:5353/api/v1/labels/${lid}`,
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

const Deletemin = async (userId) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.delete(
      `http://localhost:5353/api/v1/labels/${userId}`,
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

const EditMin = async (idd, data) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `http://localhost:5353/api/v1/labels/${idd}`,
      data,
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
  GetLable,
  AddLable,
  Deletemin,
  EditMin,
  // getAllUsers,
  // getUserById,
  // deleteUser,
  // updateUser
};

export default UserService;

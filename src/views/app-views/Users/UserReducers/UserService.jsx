import axios from "axios";
// const baseUrl = import.meta.env.VITE_BASE_URL;
// import { getToken } from "../../../configs/axiosConfig"

// const addUser = async (data) => {
//     const res = await axios.post(`${baseUrl}users/add`, data, getToken());
//     return res
// };

const GetUsers = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get("http://localhost:5353/api/v1/auth/", {
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

const Createuser = async (payload) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.post(
      "http://localhost:5353/api/v1/auth/signup/",
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

const DeleteUser = async (id) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.delete(`http://localhost:5353/api/v1/auth/${id}`, {
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

const Editusers = async (idd, values) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `http://localhost:5353/api/v1/auth/${idd}`,
      values,
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

  GetUsers,
  Createuser,
  DeleteUser,
  Editusers,
  // getAllUsers,
  // getUserById,
  // deleteUser,
  // updateUser
};

export default UserService;

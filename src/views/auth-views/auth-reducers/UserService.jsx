import axios from "axios";
// const baseUrl = import.meta.env.VITE_BASE_URL;
// import { getToken } from "../../../configs/axiosConfig"


// const addUser = async (data) => {
//     const res = await axios.post(`${baseUrl}users/add`, data, getToken());
//     return res
// };

const userLoginapi = async (data) => {
    const res = await axios.post(`http://localhost:5353/api/v1/auth/login`, data);
    return res.data
}

const autologin = async (localemail, localtoken) => {
    try {
      const res = await axios.post(
        "http://localhost:5353/api/v1/super-admin/alllogin",
        { login: localemail },
        {
          headers: {
            Authorization: `Bearer ${localtoken}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
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
    userLoginapi,
    autologin,
    // getAllUsers,    
    // getUserById,
    // deleteUser,
    // updateUser
}

export default UserService

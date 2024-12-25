import axios from "axios";
// const baseUrl = import.meta.env.VITE_BASE_URL;
// import { getToken } from "../../../configs/axiosConfig"


// const addUser = async (data) => {
    //     const res = await axios.post(`${baseUrl}users/add`, data, getToken());
    //     return res
    // };

  const RoleData = async () => {
    const token = localStorage.getItem("auth_token");
    
    try {
      const res = await axios.get(
        "http://localhost:5500/api/roles/get-all-role",
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
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
    RoleData,
    // getAllUsers,    
    // getUserById,
    // deleteUser,
    // updateUser
}

export default UserService

import axios from "axios";
// const baseUrl = import.meta.env.VITE_BASE_URL;
// import { getToken } from "../../../configs/axiosConfig"


// const addUser = async (data) => {
    //     const res = await axios.post(`${baseUrl}users/add`, data, getToken());
    //     return res
    // };

    const getMeet = async () => {
        const token = localStorage.getItem("auth_token");
        try {
          const res = await axios.get(
            "http://localhost:5353/api/v1/meetings/",
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


      const CreateMeet = async (payload) => {
        const token = localStorage.getItem("auth_token");
      
        try {
          const res = await axios.post(
            "http://localhost:5353/api/v1/meetings/",
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

      const DeleteMeet = async (id) => {
        const token = localStorage.getItem("auth_token");
      
        try {
          const res = await axios.delete(
            `http://localhost:5353/api/v1/meetings/${id}`, 
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


      const EditMeet = async (meetid, values) => {
        const token = localStorage.getItem("auth_token");
        try {
          const res = await axios.put(
            `http://localhost:5353/api/v1/meetings/${meetid}`,
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
    getMeet,
    CreateMeet,
    DeleteMeet,
    EditMeet,
    // getAllUsers,    
    // getUserById,
    // deleteUser,
    // updateUser
}

export default UserService

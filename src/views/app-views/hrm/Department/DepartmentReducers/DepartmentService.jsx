import axios from "axios";
// const baseUrl = import.meta.env.VITE_BASE_URL;
// import { getToken } from "../../../configs/axiosConfig"


// const addUser = async (data) => {
    //     const res = await axios.post(`${baseUrl}users/add`, data, getToken());
    //     return res
    // };

    const GetDept = async () => {
        const token = localStorage.getItem("auth_token");
        try {
          const res = await axios.get(
            "http://localhost:5353/api/v1/departments/get-all-departments",
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


      const AddDepartment = async (payload) => {
        const token = localStorage.getItem("auth_token");
      
        try {
          const res = await axios.post(
            "http://localhost:5353/api/v1/departments/create-department",
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

      const DeleteDept = async (id) => {
        const token = localStorage.getItem("auth_token");
      
        try {
          const res = await axios.delete(
            `http://localhost:5353/api/v1/departments/delete-department/${id}`, 
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


      const EditDept = async (comnyid, values) => {
        const token = localStorage.getItem("auth_token");
        console.log("idinapi",comnyid)
        try {
          const res = await axios.put(
            `http://localhost:5353/api/v1/departments/update-department/${comnyid}`,
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
    GetDept,
    AddDepartment,
    DeleteDept,
    EditDept,
    // getAllUsers,    
    // getUserById,
    // deleteUser,
    // updateUser
}

export default UserService

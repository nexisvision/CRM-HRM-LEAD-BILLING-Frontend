import axios from "axios";
const getAllQuotations = async (id) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(`http://localhost:5353/api/v1/sales-quotations/`, {
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
const createQuotations = async (values) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.post(
      "http://localhost:5353/api/v1/sales-quotations/",
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating quotation:", error);
    throw error;
  }
};
const deleteQuotations = async (id) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.delete(
      `http://localhost:5353/api/v1/sales-quotations/${id}`,
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
const getQuotationsById = async (id) => {
  const token = localStorage.getItem("auth_token");
  try {
    const response = await axios.get(
      `http://localhost:5353/api/v1/sales-quotations/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response.data",response.data);
    return response.data;
    
  } catch (error) {
    throw error;
  }
};
const updateQuotations = async (id, values) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `http://localhost:5353/api/v1/sales-quotations/${id}`,values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("res.data",res.data);
    console.log("updateQuoid",id);
    
    return res.data;
  } catch (error) {
    console.error("Error updating Quotations :", error);
    throw error;
  }
};
const QuotationsService = {
  // addUser,
  getAllQuotations,
  createQuotations,
  deleteQuotations,
  updateQuotations,
  getQuotationsById
};
export default QuotationsService;



// import axios from 'axios';
// // import { API_BASE_URL } from 'configs/AppConfig';

// const EstimateService = {
//   // Get all estimate

//   getAllEstimate: async (id) => {
//     const token = localStorage.getItem('auth_token');
//     try {
//         console.log('Fetching Estimate for ID:', id);
//         const response = await axios.get(`http://localhost:5353/api/v1/estimates/${id}`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log('Estimate response:', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching Estimate:', error);
//         throw error;
//     }
//   },
// //   getAllEstimate: async (id) => {
// //     const token = localStorage.getItem('auth_token');
// //     try {
// //         console.log('Fetching Estimate for ID:', id);
// //         const response = await axios.get(`http://localhost:5353/api/v1/estimates/${id}`, {
// //             headers: {
// //                 Authorization: `Bearer ${token}`,
// //                 'Content-Type': 'application/json',
// //             },
// //         });
// //         console.log('Estimate response:', response.data);
// //         return response.data; // Return the data directly
// //     } catch (error) {
// //         console.error('Error fetching estimates:', error);
// //         // Include error.response details for better debugging
// //         throw error.response?.data || error.message || 'An error occurred';
// //     }
// // },

//   // Get single estimate by ID
//   getEstimateById: async (id) => {
//     const token = localStorage.getItem('auth_token');
//     try {
//       const response = await axios.get(`http://localhost:5353/api/v1/estimates/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Create new estimate
// createEstimate: async (id, estimateData) => {
//   const token = localStorage.getItem('auth_token');
//   try {
//     console.log('Creating estimates for Project:', id);
//     const response = await axios.post(
//       `http://localhost:5353/api/v1/estimates/${id}`, 
//       estimateData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
    
//     if (response.data.success) {
//       return response.data;
//     } else {
//       throw new Error(response.data.message || 'Failed to create estimates');
//     }
//   } catch (error) {
//     console.error('Error creating estimates:', error);
//     // Access error response data with optional chaining to avoid breaking
//     throw error.response?.data || error.message;
//   }
// },


//   // Update estimate
//   updateEstimate: async (id,data) => {
//     const token = localStorage.getItem('auth_token');
//     try {
//       const response = await axios.put(`http://localhost:5353/api/v1/estimates/${id}`, data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//  // Delete estimate
// deleteEstimate: async (id) => {
//   const token = localStorage.getItem('auth_token');
//   try {
//       const response = await axios.delete(`http://localhost:5353/api/v1/estimates/${id}`, {
//           headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'application/json'
//           }
//       });
//       console.log("Deleting estimate with ID:", id);
//       return response.data;
//   } catch (error) {
//       console.error("Delete error:", error);
//       throw error;
//   }
// },

// };

// export default EstimateService;




// import axios from "axios";
// // const baseUrl = import.meta.env.VITE_BASE_URL;
// // import { getToken } from "../../../configs/axiosConfig"

// // const addUser = async (data) => {
// //     const res = await axios.post(`${baseUrl}users/add`, data, getToken());
// //     return res
// // };

// const getAllEstimate = async (id) => {
//   const token = localStorage.getItem("auth_token");
//   try {
//     const res = await axios.get(`http://localhost:5353/api/v1/estimates/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };

// const createEstimate = async (id, values) => {
//   const token = localStorage.getItem("auth_token");

//   console.log("wewwew", values);

//   try {
//     const res = await axios.post(
//       `http://localhost:5353/api/v1/estimates/${id}`,
//       values,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     //    dispatch(empdata());
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };

// const deleteEstimate = async (exid) => {
//   const token = localStorage.getItem("auth_token");

//   try {
//     const res = await axios.delete(
//       `http://localhost:5353/api/v1/estimates/${exid}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     //   dispatch(empdata());
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };

// const updateEstimate = async (id, values) => {
//   const token = localStorage.getItem("auth_token");
//   try {
//     const res = await axios.put(
//       `http://localhost:5353/api/v1/estimates/${id}`,
//       values,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return res.data;
//   } catch (error) {
//     console.error("Error updating employee data:", error);
//     throw error;
//   }
// };

// // const getAllUsers = async () => {
// //     const res = await axios.get(`${baseUrl}users/all`, getToken());
// //     return res.data
// // }

// // const getUserById = async (data) => {
// //     const res = await axios.get(`${baseUrl}users/${data}`, getToken());
// //     return res.data
// // }

// // const deleteUser = async (data) => {
// //     const res = await axios.delete(`${baseUrl}users/${data}`, getToken());
// //     return res.data
// // }

// // const updateUser = async (data) => {
// //     const res = await axios.put(`${baseUrl}users/${data?.id}`, data?.data, getToken());
// //     return res.data
// // }

// const UserService = {
//   // addUser,
//   getAllEstimate,
//   createEstimate,
//   deleteEstimate,
//   updateEstimate,
//   // getAllUsers,
//   // getUserById,
//   // deleteUser,
//   // updateUser
// };

// export default UserService;

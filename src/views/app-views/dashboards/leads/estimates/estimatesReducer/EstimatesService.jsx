import axios from 'axios';
import { env } from 'configs/EnvironmentConfig';

const EstimateService = {
  // Get all estimates
  getAllEstimate: async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await axios.get(`${env.API_ENDPOINT_URL}/quotations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new estimate
  createEstimate: async (id, estimateData) => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await axios.post(
        `${env.API_ENDPOINT_URL}/quotations/lead/${id}`,
        estimateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single estimate by ID
  getEstimateById: async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await axios.get(
        `${env.API_ENDPOINT_URL}/quotations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update estimate
  updateEstimate: async (idd, data) => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await axios.put(
        `${env.API_ENDPOINT_URL}/quotations/lead/${idd}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

   // .deleteEstimate

 deleteEstimate: async (id) => {
  const token = localStorage.getItem("auth_token");
  try {
    const response = await axios.delete(
      `${env.API_ENDPOINT_URL}/quotations/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Deleting estimate with ID:", id);
    return response.data;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}
};


export default EstimateService;

// import axios from 'axios';
// // import { API_BASE_URL } from 'configs/AppConfig';

// const EstimateService = {
//   // Get all estimate

//   getAllEstimate: async (id) => {
//     const token = localStorage.getItem('auth_token');
//     try {
//         console.log('Fetching Estimate for ID:', id);
//         const response = await axios.get(`${env.API_ENDPOINT_URL}/estimates/${id}`, {
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
//   getAllEstimate: async (id) => {
//     const token = localStorage.getItem('auth_token');
//     try {
//         console.log('Fetching Estimate for ID:', id);
//         const response = await axios.get(`${env.API_ENDPOINT_URL}/estimates/${id}`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//         });
//         console.log('Estimate response:', response.data);
//         return response.data; // Return the data directly
//     } catch (error) {
//         console.error('Error fetching estimates:', error);
//         // Include error.response details for better debugging
//         throw error.response?.data || error.message || 'An error occurred';
//     }
// },

//   // Get single estimate by ID
//   getEstimateById: async (id) => {
//     const token = localStorage.getItem('auth_token');
//     try {
//       const response = await axios.get(`${env.API_ENDPOINT_URL}/estimates/${id}`, {
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
//       `${env.API_ENDPOINT_URL}/estimates/${id}`, 
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
//       const response = await axios.put(`${env.API_ENDPOINT_URL}/estimates/${id}`, data, {
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
//       const response = await axios.delete(`${env.API_ENDPOINT_URL}/estimates/${id}`, {
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




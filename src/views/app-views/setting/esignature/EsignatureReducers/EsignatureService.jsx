import axios from "axios";
import { env } from "configs/EnvironmentConfig";


const getsignature = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(`${env.API_ENDPOINT_URL}/esignatures/`, {
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

const addesignature = async (payload) => {
  const token = localStorage.getItem("auth_token");

  try {
    // Create new instance of FormData if payload isn't already FormData
    const formData = payload instanceof FormData ? payload : new FormData();

    const res = await axios({
      method: 'post',
      url: `${env.API_ENDPOINT_URL}/esignatures/`,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        // Let axios set the boundary automatically
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error uploading signature:", error);
    throw error;
  }
};

const deletesig = async (id) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.delete(
      `${env.API_ENDPOINT_URL}/esignatures/${id}`,
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

const editpolicy = async (idd, formData) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `${env.API_ENDPOINT_URL}/policies/${idd}`,
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



const UserService = {

  getsignature,
  addesignature,
  deletesig,
  editpolicy,

};

export default UserService;

import axios from "axios";
import { env } from "configs/EnvironmentConfig";


const userLoginapi = async (data) => {
    const res = await axios.post(`${env.API_ENDPOINT_URL}/auth/login`, data);
    return res.data
}

const autologin = async (localemail, localtoken) => {
    try {
      const res = await axios.post(
        `${env.API_ENDPOINT_URL}/super-admin/alllogin`,
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



const forgotpass = async (data) => {
  const res = await axios.post(`${env.API_ENDPOINT_URL}/auth/forgot-password`, data);
  localStorage.setItem('sessionToken',res.data.data.sessionToken)
  return res.data
}

const forgototps = async (payload) => {
  const token = localStorage.getItem("sessionToken");

  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/auth/verify-otp`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    localStorage.setItem('otpsessionToken',res.data.data.token)
    //    dispatch(empdata());
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const resetpass = async (payload) => {
  const token = localStorage.getItem("otpsessionToken");

  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/auth/reset-password`,
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



const updatesuperadmin = async (id ,data) => {
  const token = localStorage.getItem("auth_token");

    const res = await axios.put(`http://localhost:5353/api/v1/super-admin/${id}`,
     data,
     {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    );
    return res.data
}

const UserService = {
    // addUser,
    userLoginapi,
    autologin,
    forgotpass,
    forgototps,
    resetpass,
    updatesuperadmin,
    // getAllUsers,    
    // getUserById,
    // deleteUser,
    // updateUser
}

export default UserService

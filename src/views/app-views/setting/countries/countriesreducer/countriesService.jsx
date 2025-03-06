import axios from "axios";
import { env } from "configs/EnvironmentConfig";
const AddCountries = async (payload) => {
    const token = localStorage.getItem("auth_token");
    try {
        const res = await axios.post(`${env.API_ENDPOINT_URL}/countries/`, payload, {
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
const GetAllCountries = async () => {
    const token = localStorage.getItem("auth_token");
    try {
        const res = await axios.get(`${env.API_ENDPOINT_URL}/countries/`, {
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

const updateCountries = async (id,values) => {
    const token = localStorage.getItem("auth_token");
    try {
        const res = await axios.put(`${env.API_ENDPOINT_URL}/countries/${id}`,
         values,{
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


const deleteCountries = async (id) => {
    const token = localStorage.getItem("auth_token");
  
    try {
      const res = await axios.delete(
        `${env.API_ENDPOINT_URL}/countries/${id}`,
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


const UserAddCountries ={
    GetAllCountries,
    AddCountries,
    updateCountries,
    deleteCountries
}
export default UserAddCountries;
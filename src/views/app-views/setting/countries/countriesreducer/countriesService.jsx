import axios from "axios";
const AddCountries = async (payload) => {
    const token = localStorage.getItem("auth_token");
    try {
        const res = await axios.post("http://localhost:5353/api/v1/countries/", payload, {
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
        const res = await axios.get("http://localhost:5353/api/v1/countries/", {
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

const updateCountries = async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
        const res = await axios.put(`http://localhost:5353/api/v1/countries/${id}`, {
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
        const res = await axios.delete(`http://localhost:5353/api/v1/countries/${id}`, {
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


const UserAddCountries ={
    GetAllCountries,
    AddCountries,
    updateCountries,
    deleteCountries
}
export default UserAddCountries;
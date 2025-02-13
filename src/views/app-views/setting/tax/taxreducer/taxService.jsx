import axios from "axios";

const GetAllTax = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(
      "http://localhost:5353/api/v1/taxes/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching tax data:", error);
    throw error;
  }
};

const CreateTax = async (payload) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.post(
      "http://localhost:5353/api/v1/taxes/",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating tax:", error);
    throw error;
  }
};

const UpdateTax = async (id, values) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `http://localhost:5353/api/v1/taxes/${id}`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating tax:", error);
    throw error;
  }
};

const DeleteTax = async (id) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.delete(
      `http://localhost:5353/api/v1/taxes/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting tax:", error);
    throw error;
  }
};

const TaxService = {
  CreateTax,
  GetAllTax,
  UpdateTax,
  DeleteTax,
};

export default TaxService;

import axios from "axios";

const GetAllDebit = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(
      "http://localhost:5353/api/v1/bill-debits/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching debit data:", error);
    throw error;
  }
};

const CreateDebit = async (payload) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.post(
      "http://localhost:5353/api/v1/bill-debits/",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating debit:", error);
    throw error;
  }
};

const UpdateDebit = async (id, values) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `http://localhost:5353/api/v1/bill-debits/${id}`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating debit:", error);
    throw error;
  }
};

const DeleteDebit = async (id) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.delete(
      `http://localhost:5353/api/v1//bill-debits/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting debit:", error);
    throw error;
  }
};

const DebitService = {
  CreateDebit,
  GetAllDebit,
  UpdateDebit,
  DeleteDebit,
};

export default DebitService;

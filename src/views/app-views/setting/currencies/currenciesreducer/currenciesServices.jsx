import axios from "axios";
// const AddCurrencies = async (payload) => {
//     const token = localStorage.getItem("auth_token");
//     try {
//         const res = await axios.post("http://localhost:5353/api/v1/currencies/", payload, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return res.data;
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         throw error;
//     }
// };
const GetAllCurrencies = async () => {
    const token = localStorage.getItem("auth_token");
    try {
        const res = await axios.get("http://localhost:5353/api/v1/currencies/", {
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
const UserAddCurrencies ={
    GetAllCurrencies,
    // AddCurrencies,
}
export default UserAddCurrencies;
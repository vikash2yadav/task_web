import axios from "axios";
const api_url = process.env.API_URL;

export const callApi = async (url, body, method = "POST") => {
  const token = localStorage.getItem('token');
  const headers = {
    token
  }

  try {
    const response = await axios({
      // url: "https://task-back-api.onrender.com/" + url,
      url: "https://task-back-api.vercel.app/" + url,
      data: body,
      headers: headers,
      method: method,
      timeout: 120000,
    });
    return response;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

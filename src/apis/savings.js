import { callApi } from ".";

export const addSavingApi = async (url, body) => {
  return await callApi(url, body, "POST");
};

export const updateSavingApi = async (url, body) => {
  return await callApi(url, body, "PUT");
};

export const deleteSavingApi = async (url, body) => {
  return await callApi(url, body, "DELETE");
}

export const getSavingByIdApi = async (url, body) => {
  return await callApi(url, body, "GET");
}

export const getSavingApi = async (url, body) => {
  return await callApi(url, body, "POST");
};

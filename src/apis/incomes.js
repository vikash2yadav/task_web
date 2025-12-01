import { callApi } from ".";

export const addIncomeApi = async (url, body) => {
  return await callApi(url, body, "POST");
}

export const updateIncomeApi = async (url, body) => {
  return await callApi(url, body, "PUT");
}

export const deleteIncomeApi = async (url, body) => {
  return await callApi(url, body, "DELETE");
}

export const getIncomeByIdApi = async (url, body) => {
  return await callApi(url, body, "GET");
}

export const getIncomeApi = async (url, body) => {
  return await callApi(url, body, "POST");
};

import { callApi } from ".";

export const addExpenseApi = async (url, body) => {
  return await callApi(url, body, "POST");
}

export const updateExpenseApi = async (url, body) => {
  return await callApi(url, body, "PUT");
}

export const deleteExpenseApi = async (url, body) => {
  return await callApi(url, body, "DELETE");
}

export const getExpenseByIdApi = async (url, body) => {
  return await callApi(url, body, "GET");
}

export const getExpenseApi = async (url, body) => {
  return await callApi(url, body, "POST");
};

export const getCountApi = async (url, body) => {
  return await callApi(url, body, "GET");
};
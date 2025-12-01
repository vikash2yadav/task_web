import { callApi } from ".";

export const newUserApi = async (url, body) => {
    return await callApi(url, body, "POST");
}

export const loginApi = async (url, body) => {
    return await callApi(url, body, "POST");
} 

export const getUserInfoApi = async (url, body) => {
    return await callApi(url, body, "GET");
} 

export const sendOtpApi = async (url, body) => {
    return await callApi(url, body, "POST");
}

export const changePasswordApi = async (url, body) => {
    return await callApi(url, body, "POST");
} 
import { isValidEmail } from "6pp";

export const emailValidator = (email) => {
  if (!email || email.trim() === "") {
    return "Email is required";
  }

  if (!isValidEmail(email)) {
    return "Email is invalid";
  }

  return "";
};

export const passwordValidator = (password) => {
  if (!password || password.trim() === "") {
    return "Password is required";
  }

  if (password.length < 2) {
    return "Password is too short";
  }
  return "";
};

export const nameValidator = (name) => {
  if (!name || name.trim() === "") {
    return "Name is required";
  }

  if (name.length < 2) {
    return "Name is too short";
  }

  return "";
};

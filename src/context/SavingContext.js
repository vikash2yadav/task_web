import React, { createContext, useContext } from "react";
import { toast } from "react-hot-toast";
import { getSavingApi } from "../apis/savings.js";
import { CommonContext } from "./CommonContext.js";

export const SavingContext = createContext();

export const SavingContextProvider = ({ children }) => {
  const { setData } = useContext(CommonContext);

  const getAllSavings = async () => {
    let response = await getSavingApi(`saving/list`);
    if (response.status === 200) {
      setData(response?.data?.saving);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <SavingContext.Provider
      value={{
        getAllSavings,
      }}
    >
      {children}
    </SavingContext.Provider>
  );
};

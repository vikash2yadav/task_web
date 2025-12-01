import React, { createContext, useContext } from "react";
import { toast } from "react-hot-toast";
import { getIncomeApi } from "../apis/incomes.js";
import { CommonContext } from "./CommonContext.js";

export const IncomeContext = createContext();

export const IncomeContextProvider = ({ children }) => {
  const { setData } = useContext(CommonContext);

  const getAllIncomes = async () => {
    let response = await getIncomeApi(`income/list`);
    if (response.status === 200) {
      setData(response?.data?.income);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <IncomeContext.Provider
      value={{
        getAllIncomes,
      }}
    >
      {children}
    </IncomeContext.Provider>
  );
};

import React, { createContext, useContext } from "react";
import { getExpenseApi } from "../apis/expenses.js";
import { CommonContext } from "./CommonContext.js";
import { toast } from "react-hot-toast";

export const ExpenseContext = createContext();

export const ExpenseContextProvider = ({ children }) => {
  const { setData } = useContext(CommonContext);

  const getAllExpenses = async () => {
    let response = await getExpenseApi(`expense/list`);
    if (response.status === 200) {
      setData(response?.data?.expense);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        getAllExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

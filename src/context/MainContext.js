import React from "react";
import { CommonContextProvider } from "./CommonContext";
import { IncomeContextProvider } from "./IncomeContext";
import { ExpenseContextProvider } from "./ExpenseContext";
import { SavingContextProvider } from "./SavingContext";

export const MainContext = ({ children }) => {
  return (
    <CommonContextProvider>
      <IncomeContextProvider>
        <ExpenseContextProvider>
          <SavingContextProvider>{children}</SavingContextProvider>
        </ExpenseContextProvider>
      </IncomeContextProvider>
    </CommonContextProvider>
  );
};

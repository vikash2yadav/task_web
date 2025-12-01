import React, { createContext, useState } from "react";

export const CommonContext = createContext();

export const CommonContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("incomes");
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [isFormEdit, setIsFormEdit] = useState(false);

  return (
    <CommonContext.Provider
      value={{
        loading,
        setLoading,
        type,
        setType,
        data,
        setData,
        open,
        setOpen,
        isFormEdit,
        setIsFormEdit,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};

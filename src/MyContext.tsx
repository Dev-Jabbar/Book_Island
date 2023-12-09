// MyContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

interface MyContextProps {
  username: string;
  password: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  isLoggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  points: number;
  order: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  setOrder: React.Dispatch<React.SetStateAction<number>>;
}

const MyContext = createContext<MyContextProps | undefined>(undefined);

export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(100); // Initialize points as a number
  const [order, setOrder] = useState<number>(0); // Initialize points as a number
  return (
    <MyContext.Provider
      value={{
        username,
        password,
        setUsername,
        setPassword,
        isLoggedIn,
        setLoggedIn,
        points,
        setPoints,
        order,
        setOrder,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = (): MyContextProps => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};

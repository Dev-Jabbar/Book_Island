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
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  customerId: number | null;
  setCustomerId: React.Dispatch<React.SetStateAction<number | null>>;
  runFetchBooks: boolean; // Add the new property to the interface
  setRunFetchBooks: React.Dispatch<React.SetStateAction<boolean>>; // Add the new property to the interface
}

const MyContext = createContext<MyContextProps | undefined>(undefined);

export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(100);
  const [order, setOrder] = useState<number>(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [runFetchBooks, setRunFetchBooks] = useState(false); // Initialize the state

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
        error,
        setError,
        customerId,
        setCustomerId,
        runFetchBooks, // Include the new property in the value
        setRunFetchBooks, // Include the new property in the value
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

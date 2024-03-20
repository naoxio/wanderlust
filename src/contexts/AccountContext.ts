import React, { createContext, useContext, useState } from 'react';

interface AccountContextType {
  isLoggedIn: boolean;
  login: () => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);
const AccountProvider: React.FC = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    setIsLoggedIn(true);
  };

  return (
    <AccountContext.Provider value={{ isLoggedIn, login }}>
      {children}
    </AccountContext.Provider>
  );
};

const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};

export { AccountProvider, useAccount };

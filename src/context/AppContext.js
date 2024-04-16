import { createContext, useState } from "react";

export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(0);
  function closeAddModal() {
    setIsAddModalOpen(false);
  }
  function openAddModal() {
    setIsAddModalOpen(true);
  }

  return (
    <AppContext.Provider
      value={{ isAddModalOpen, openAddModal, closeAddModal }}
    >
      {children}
    </AppContext.Provider>
  );
}

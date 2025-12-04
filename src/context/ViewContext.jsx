
import { createContext, useState } from "react";

export const ViewContext = createContext();

export const ViewProvider = ({ children }) => {
  const [view, setView] = useState("grid");

  const toggleView = (type) => {
 setView(type)
  };

  return (
    <ViewContext.Provider value={{ view, toggleView }}>
      {children}
    </ViewContext.Provider>
  );
};

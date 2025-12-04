import { useContext } from "react";
import { ViewContext } from "../context/ViewContext";
import "../styles/ViewToggle.css";

const ViewToggle = () => {
  const { view, toggleView } = useContext(ViewContext);

  return (
    <div className="toggle-container">
      <button
        className={`toggle-btn ${view === "grid" ? "active" : ""}`}
        onClick={() => toggleView("grid")}
      >
        Grid
      </button>

      <button
        className={`toggle-btn ${view === "table" ? "active" : ""}`}
        onClick={() => toggleView("table")}
      >
        Table
      </button>
    </div>
  );
};

export default ViewToggle;

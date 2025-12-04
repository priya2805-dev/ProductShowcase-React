import { useContext } from "react";
import { ViewContext } from "../context/ViewContext";

const ViewToggle = () => {
  const { view, setView } = useContext(ViewContext);

  return (
    <div>
      <button onClick={() => setView("table")} disabled={view === "table"}>
        List
      </button>
      <button onClick={() => setView("grid")} disabled={view === "grid"}>
        Grid
      </button>
    </div>
  );
};

export default ViewToggle;

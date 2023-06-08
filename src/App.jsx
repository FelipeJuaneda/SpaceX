import { BrowserRouter } from "react-router-dom";
import "./App.css";

import RoutesContainer from "./components/RoutesContainer/RoutesContainer";
function App() {
  return (
    <div style={{ background: "#121212" }}>
      <BrowserRouter>
        <RoutesContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;

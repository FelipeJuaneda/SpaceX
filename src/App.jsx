import { BrowserRouter } from "react-router-dom";
import "./App.css";

import RoutesContainer from "./components/RoutesContainer/RoutesContainer";
import FavoriteContextProvider from "./context/FavoriteContext";
function App() {
  return (
    <FavoriteContextProvider>
      <div style={{ background: "#121212" }}>
        <BrowserRouter>
          <RoutesContainer />
        </BrowserRouter>
      </div>
    </FavoriteContextProvider>
  );
}

export default App;

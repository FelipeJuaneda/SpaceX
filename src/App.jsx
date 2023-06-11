import { BrowserRouter } from "react-router-dom";
import "./App.css";

import RoutesContainer from "./components/RoutesContainer/RoutesContainer";
import FavoriteContextProvider from "./context/FavoriteContext";
function App() {
  return (
    <FavoriteContextProvider>
      <BrowserRouter>
        <RoutesContainer />
      </BrowserRouter>
    </FavoriteContextProvider>
  );
}

export default App;

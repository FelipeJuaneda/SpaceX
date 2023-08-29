import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RoutesContainer from "./Routes/RoutesContainer/RoutesContainer";
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

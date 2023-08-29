import "./App.css";
import { BrowserRouter } from "react-router-dom";
import FavoriteContextProvider from "./context/FavoriteContext";
import RoutesContainer from "./Routes/RoutesContainer/RoutesContainer";

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

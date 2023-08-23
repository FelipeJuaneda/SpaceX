import "./App.css";
import { BrowserRouter } from "react-router-dom";
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

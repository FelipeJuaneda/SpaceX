import "./App.css";
import CardListContainer from "./components/CardListContainer/CardListContainer";
import NavBar from "./components/NavBar/NavBar";
import SearchBar from "./components/SearchBar/SearchBar";
function App() {
  return (
    <div style={{ background: "#121212" }}>
      <NavBar />
      <SearchBar />
      <CardListContainer />
    </div>
  );
}

export default App;

import { Outlet, Route, Routes } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import SearchBar from "../SearchBar/SearchBar";
import CardListContainer from "../CardListContainer/CardListContainer";
import LauncherDetailContainer from "../LauncherDetailContainer/LauncherDetailContainer";
import Favorites from "../Favorites/Favorites";

function RoutesContainer() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <SearchBar />
            <CardListContainer />
            <Outlet />
          </>
        }
      />
      <Route path="launcher/:id" element={<LauncherDetailContainer />} />
      <Route path="favorites" element={<Favorites />} />
    </Routes>
  );
}

export default RoutesContainer;

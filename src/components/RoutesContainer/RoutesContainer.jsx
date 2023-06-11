import { Outlet, Route, Routes } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import SearchBar from "../SearchBar/SearchBar";
import CardListContainer from "../CardListContainer/CardListContainer";
import LauncherDetailContainer from "../LauncherDetail/LauncherDetail";
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
            <Outlet />
          </>
        }
      >
        <Route index element={<CardListContainer />} />
        <Route path="favorites" element={<Favorites />} />
      </Route>
      <Route path="launcher/:id" element={<LauncherDetailContainer />} />
    </Routes>
  );
}

export default RoutesContainer;

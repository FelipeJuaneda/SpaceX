import { Outlet, Route, Routes } from "react-router-dom";
import NavBar from "../../layouts/NavBar/NavBar";
import Footer from "../../layouts/Footer/Footer";
import CardListContainer from "../../Pages/CardListContainer/CardListContainer";
import Favorites from "../../Pages/Favorites/Favorites";
import LauncherDetail from "../../Pages/LauncherDetail/LauncherDetail";

function RoutesContainer() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <Outlet />
            <Footer />
          </>
        }
      >
        <Route index element={<CardListContainer />} />
        <Route path="favorites" element={<Favorites />} />
      </Route>
      <Route path="launcher/:id" element={<LauncherDetail />} />
    </Routes>
  );
}

export default RoutesContainer;

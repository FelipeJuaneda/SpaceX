import { createContext, useContext, useEffect, useReducer } from "react";
import FavReducer from "./FavReducer";

const FavoriteContext = createContext();
export const useFavoriteContext = () => useContext(FavoriteContext);

const initialState = {
  favoritelauncher: localStorage.getItem("favoritelauncher")
    ? JSON.parse(localStorage.getItem("favoritelauncher"))
    : [],
};

const FavoriteContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(FavReducer, initialState);

  useEffect(() => {
    localStorage.setItem(
      "favoritelauncher",
      JSON.stringify(state.favoritelauncher)
    );
  }, [state.favoritelauncher]);

  const addLauncherToFavorite = (launcher) => {
    dispatch({ type: "ADD_LAUNCHER_TO_FAVORITELAUNCHER", payload: launcher });
  };

  const removeLauncherToFavorite = (id) => {
    dispatch({ type: "REMOVE_LAUNCHER_TO_FAVORITELAUNCHER", payload: id });
  };

  const removeAllLauncherInFavorite = () => {
    dispatch({ type: "REMOVE_ALL_LAUNCHER_IN_FAVORITELAUNCHER" });
  };
  const handleSort = (sortType) => {
    dispatch({ type: "UPDATE_SORT_LAUNCHER", sortType });
  };

  return (
    <FavoriteContext.Provider
      value={{
        favoritelauncher: state.favoritelauncher,
        addLauncherToFavorite,
        removeLauncherToFavorite,
        removeAllLauncherInFavorite,
        handleSort,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export default FavoriteContextProvider;

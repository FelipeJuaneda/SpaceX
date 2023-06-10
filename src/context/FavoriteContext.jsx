import { createContext, useContext, useEffect, useReducer } from "react";
import FavReducer from "./FavReducer";
const FavoriteContext = createContext();
export const useFavoriteContext = () => useContext(FavoriteContext);

const FavoriteContextProvider = ({ children }) => {
  //estado donde guarda las lista de favs
  const initialState = {
    favoritelauncher: localStorage.getItem("favoritelauncher")
      ? JSON.parse(localStorage.getItem("favoritelauncher"))
      : [],
  };
  //use reduce para agregar a favorito cohetes
  const [state, dispatch] = useReducer(FavReducer, initialState);
  console.log(state.favoritelauncher);
  useEffect(() => {
    localStorage.setItem(
      "favoritelauncher",
      JSON.stringify(state.favoritelauncher)
    );
  }, [state]);

  //AGREGANDO FAVORITE LIST CON USE REDUCE
  const addLauncherToFavorite = (launcher) => {
    dispatch({ type: "ADD_LAUNCHER_TO_FAVORITELAUNCHER", payload: launcher });
  };
  const removeLauncherToFavorite = (id) => {
    dispatch({ type: "REMOVE_LAUNCHER_TO_FAVORITELAUNCHER", payload: id });
  };
  const removeAllLauncherInFavorite = () => {
    dispatch({ type: "REMOVE_ALL_LAUNCHER_IN_FAVORITELAUNCHER" });
  };

  return (
    <FavoriteContext.Provider
      value={{
        favoritelauncher: state.favoritelauncher,
        addLauncherToFavorite,
        removeLauncherToFavorite,
        removeAllLauncherInFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export default FavoriteContextProvider;

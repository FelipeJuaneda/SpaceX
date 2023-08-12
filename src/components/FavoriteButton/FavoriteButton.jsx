import { useEffect, useState } from "react";
import { useFavoriteContext } from "../../context/FavoriteContext";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";
import { IconButton } from "@mui/material";

const FavoriteButton = ({ id, launch, style }) => {
  const { favoritelauncher, addLauncherToFavorite, removeLauncherToFavorite } =
    useFavoriteContext();
  console.log(favoritelauncher);

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (favoritelauncher) {
      const ifLauncherIsIn = favoritelauncher.find((e) => e.id === id);
      setIsFavorite(!!ifLauncherIsIn);
    }
  }, [favoritelauncher, id]);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    if (isFavorite) {
      removeLauncherToFavorite(id);
    } else {
      addLauncherToFavorite(launch);
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <IconButton
      onClick={handleToggleFavorite}
      sx={{
        color: "#ffffff78",
        margin: `${style && "0 20px"}`,
        backgroundColor: `${style && "rgba(0, 0, 0, 0.5)"}`,
      }}
    >
      {isFavorite ? (
        <IoIosStar fontSize={"20px"} />
      ) : (
        <IoIosStarOutline fontSize={"20px"} />
      )}
    </IconButton>
  );
};

export default FavoriteButton;

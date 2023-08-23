import { useEffect, useState } from "react";
import { useFavoriteContext } from "../../context/FavoriteContext";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";
import { Box, IconButton, Typography } from "@mui/material";
import { toast } from "sonner";
import { MdDelete } from "react-icons/md";

const FavoriteButton = ({ id, launch, style }) => {
  const { favoritelauncher, addLauncherToFavorite, removeLauncherToFavorite } =
    useFavoriteContext();

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
      toast(
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <MdDelete fontSize={"16px"} />
          <Typography sx={{ fontSize: "13px" }}>
            {`"${launch.name}" removed from Favorites`}
          </Typography>
        </Box>
      );
    } else {
      toast.success(`Added "${launch.name}" to Favorites`);
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

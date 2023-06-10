import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useFavoriteContext } from "../../context/FavoriteContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const Favorites = () => {
  const { favoritelauncher, removeLauncherToFavorite, addLauncherToFavorite } =
    useFavoriteContext();

  const ifLauncherIsIn = favoritelauncher.find(
    (e) => e.id === favoritelauncher.id
  );
  const [isFavorite, setIsFavorite] = useState(ifLauncherIsIn);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeLauncherToFavorite(favoritelauncher.id);
    } else {
      addLauncherToFavorite(favoritelauncher);
    }

    setIsFavorite(!isFavorite);
  };
  const formatDate = (dateString) => {
    const dateLocal = dateString;
    const date = new Date(dateLocal);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };
  const formattedDate = formatDate(favoritelauncher.date_local);

  const getRandomImage = () => {
    if (favoritelauncher.rocket?.flickr_images?.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * favoritelauncher.rocket.flickr_images.length
      );
      return favoritelauncher.rocket.flickr_images[randomIndex];
    }
  };
  const randomImage = getRandomImage();
  return (
    <Grid
      padding={"0 30px"}
      container
      spacing={4}
      direction="row"
      justifyContent="center"
      alignItems="center"
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    >
      <>
        {favoritelauncher.map((favorite, index) => {
          return (
            <Card
              key={index}
              sx={{
                background:
                  "linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), #121212",
              }}
            >
              <Grid padding={"0"} xs={12} sm={6} md={4} lg={3} item>
                {favorite?.rocket?.flickr_images && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={randomImage}
                    alt={randomImage}
                  />
                )}
                <CardContent>
                  <Stack
                    height={120}
                    direction="column"
                    justifyContent="center"
                  >
                    <Link to={`launcher/${favorite.id}`}>
                      <Typography
                        color="#FFFFFF"
                        gutterBottom
                        fontSize={"20px"}
                        fontStyle={"normal"}
                        fontWeight={"700"}
                        lineHeight={"32px"}
                        component="div"
                      >
                        {favorite.name}
                      </Typography>
                    </Link>
                    <Typography
                      sx={{
                        color: "#FFFFFF",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                      variant="body2"
                      color="text.secondary"
                    >
                      {favorite.details
                        ? favorite.details
                        : "First orbital class rocket capable of reflight"}
                    </Typography>
                    <Stack
                      sx={{ color: "#ffffff78" }}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontSize={"14px"}>{formattedDate}</Typography>
                      <IconButton
                        onClick={handleToggleFavorite}
                        sx={{ color: "#ffffff78" }}
                      >
                        {ifLauncherIsIn ? (
                          <AiFillStar fontSize={"20px"} />
                        ) : (
                          <AiOutlineStar fontSize={"20px"} />
                        )}
                      </IconButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Grid>
            </Card>
          );
        })}
      </>
    </Grid>
  );
};

export default Favorites;

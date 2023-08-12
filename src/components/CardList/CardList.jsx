import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Card, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import FavoriteButton from "../FavoriteButton/FavoriteButton";

const CardList = ({ launch, rocket }) => {
  const getRandomImage = () => {
    if (rocket?.flickr_images?.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * rocket.flickr_images.length
      );
      return rocket.flickr_images[randomIndex];
    }
  };
  const randomImage = getRandomImage();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };
  const formattedDate = formatDate(launch.date_local);

  return (
    <Link to={`/launcher/${launch.id}`} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          background:
            "linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), #121212",
        }}
      >
        {rocket?.flickr_images && (
          <CardMedia
            component="img"
            height="140"
            image={randomImage}
            alt={randomImage}
          />
        )}
        <CardContent>
          <Stack height={120} direction="column" justifyContent="center">
            <Typography
              color="#FFFFFF"
              gutterBottom
              variant="h6"
              sx={{
                fontSize: "20px",
                fontWeight: "700",
                lineHeight: "32px",
              }}
              component="div"
            >
              {launch.name}
            </Typography>
            <Typography
              sx={{
                color: "#FFFFFF",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
              variant="body2"
              color="text.secondary"
            >
              {launch.details
                ? launch.details
                : "First orbital class rocket capable of reflight"}
            </Typography>
            <Stack
              sx={{ color: "#ffffff78", zIndex: 1 }}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography sx={{ fontSize: "14px" }}>{formattedDate}</Typography>
              <FavoriteButton id={launch.id} launch={launch} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CardList;

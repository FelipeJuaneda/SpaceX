import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, IconButton, Stack } from "@mui/material";
import { AiOutlineStar } from "react-icons/ai";

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
    const dateLocal = dateString;
    const date = new Date(dateLocal);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };
  const formattedDate = formatDate(launch.date_local);

  return (
    <Card
      sx={{
        background:
          "linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), #121212",
      }}
    >
      <CardActionArea>
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
              fontSize={"20px"}
              fontStyle={"normal"}
              fontWeight={"700"}
              lineHeight={"32px"}
              component="div"
            >
              {launch.name}
            </Typography>
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
              {launch.details
                ? launch.details
                : "First orbital class rocket capable of reflight"}
            </Typography>
            <Stack
              sx={{ color: "#ffffff78" }}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontSize={"14px"}>{formattedDate}</Typography>
              <IconButton sx={{ color: "#ffffff78" }}>
                <AiOutlineStar fontSize={"20px"} />
              </IconButton>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CardList;

import { Grid } from "@mui/material";
import CardList from "../CardList/CardList";
import { useFavoriteContext } from "../../context/FavoriteContext";

const Favorites = () => {
  const { favoritelauncher } = useFavoriteContext();

  return (
    <Grid
      padding={"0 30px"}
      container
      spacing={4}
      minHeight={"70vh"}
      direction="row"
      justifyContent="center"
      alignItems="center"
      backgroundColor="#121212"
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    >
      {favoritelauncher.map((favorite) => (
        <Grid padding={"0"} xs={12} sm={6} md={4} lg={3} item key={favorite.id}>
          <CardList launch={favorite} rocket={favorite.rocket} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Favorites;

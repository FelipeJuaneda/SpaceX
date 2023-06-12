import { Box, Grid, Typography } from "@mui/material";
import CardList from "../CardList/CardList";
import { useFavoriteContext } from "../../context/FavoriteContext";
import SearchBar from "../SearchBar/SearchBar";
import { useLaunches } from "../../hooks/useLaunches";

const Favorites = () => {
  const { favoritelauncher } = useFavoriteContext();
  const { searchTerm, setSearchTerm } = useLaunches();

  const filteredLaunches = favoritelauncher.filter((launch) =>
    launch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <SearchBar setSearchTerm={setSearchTerm} />
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
        {filteredLaunches.length === 0 ? (
          <Typography color={"white"} variant="body1">
            No se encontraron resultados en Favourites
          </Typography>
        ) : (
          filteredLaunches.map((favorite) => (
            <Grid
              padding={"0"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              item
              key={favorite.id}
            >
              <CardList launch={favorite} rocket={favorite.rocket} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default Favorites;

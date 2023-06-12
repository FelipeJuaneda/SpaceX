// Favorites.jsx
import { Box, Grid, Typography } from "@mui/material";
import CardList from "../CardList/CardList";
import { useFavoriteContext } from "../../context/FavoriteContext";
import SearchBar from "../SearchBar/SearchBar";
import usePagination from "../../hooks/usePagination";
import PaginationCont from "../PaginationCont/PaginationCont";
import { useLaunches } from "../../hooks/useLaunches";

const Favorites = () => {
  const { favoritelauncher } = useFavoriteContext();
  const { searchTerm, setSearchTerm } = useLaunches();

  const pageSize = 9;
  const filteredLaunches = favoritelauncher.filter((launch) =>
    launch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { totalPageCount, getCurrentPageData, handlePageChange, currentPage } =
    usePagination(filteredLaunches, pageSize);

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
        {getCurrentPageData().length === 0 ? (
          <Typography color={"white"} variant="body1">
            No se encontraron resultados en Favourites
          </Typography>
        ) : (
          getCurrentPageData().map((favorite) => (
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
      <PaginationCont
        count={totalPageCount}
        page={currentPage + 1}
        onChange={handlePageChange}
      />
    </Box>
  );
};

export default Favorites;

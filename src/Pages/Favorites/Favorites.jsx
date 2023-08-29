import { Box, Grid, Typography } from "@mui/material";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import CardList from "../../components/CardList/CardList";
import SearchBar from "../../components/SearchBar/SearchBar";
import usePagination from "../../hooks/usePagination";
import PaginationCont from "../../components/PaginationCont/PaginationCont";
import { useFavoriteContext } from "../../context/FavoriteContext";
import { useLaunches } from "../../hooks/useLaunches";
import TotalResults from "../../components/TotalResults/TotalResults";

const Favorites = () => {
  const { favoritelauncher } = useFavoriteContext();
  const { searchTerm, setSearchTerm } = useLaunches();
  const [listRef] = useAutoAnimate();

  const pageSize = 9;
  const filteredLaunches = favoritelauncher.filter((launch) =>
    launch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { totalPageCount, getCurrentPageData, handlePageChange, currentPage } =
    usePagination(filteredLaunches, pageSize);

  const currentPageData = getCurrentPageData();
  if (currentPageData.length === 0 && currentPage > 0) {
    handlePageChange(null, currentPage); // Vuelve a la página anterior
  }
  return (
    <Box>
      <SearchBar setSearchTerm={setSearchTerm} />
      <TotalResults results={filteredLaunches.length} />
      <Grid
        ref={listRef}
        container
        spacing={4}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          marginTop: "0",
          padding: "0 30px",
          minHeight: "60vh",
          backgroundColor: "#121212",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {getCurrentPageData().length === 0 ? (
          <Typography color="white" variant="body1">
            No results found in Favorites
          </Typography>
        ) : (
          getCurrentPageData().map((favorite) => (
            <Grid
              item
              key={favorite.id}
              marginTop={0}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{ padding: "0" }}
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

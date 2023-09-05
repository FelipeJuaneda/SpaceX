import { Box, Grid, Stack, Typography } from "@mui/material";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import CardList from "../../components/CardList/CardList";
import SearchBar from "../../components/SearchBar/SearchBar";
import usePagination from "../../hooks/usePagination";
import PaginationCont from "../../components/PaginationCont/PaginationCont";
import { useFavoriteContext } from "../../context/FavoriteContext";
import TotalResults from "../../components/TotalResults/TotalResults";
import { useMemo } from "react";
import useSearch from "../../hooks/useSearch";
import { SortButton } from "../../components/SortButton/SortButton";

const Favorites = () => {
  const { favoritelauncher } = useFavoriteContext();
  const { searchTerm, setSearchTerm } = useSearch();
  const [listRef] = useAutoAnimate();
  const pageSize = 9;
  const filteredLaunches = useMemo(() => {
    return favoritelauncher.filter((launch) =>
      launch.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [favoritelauncher, searchTerm]);
  const { totalPageCount, getCurrentPageData, handlePageChange, currentPage } =
    usePagination(filteredLaunches, pageSize);

  return (
    <Box sx={{ backgroundColor: "#121212" }}>
      <SearchBar setSearchTerm={setSearchTerm} />
      <Stack justifyContent={"space-between"} direction="row" flexWrap="wrap">
        <TotalResults results={filteredLaunches.length} />
        <SortButton />
      </Stack>
      <Grid
        container
        ref={listRef}
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

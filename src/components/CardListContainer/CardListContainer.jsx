// CardListContainer.jsx
import { Box, Grid, Typography } from "@mui/material";
import { Loading } from "../Loading/Loading";
import SearchBar from "../SearchBar/SearchBar";
import CardList from "../CardList/CardList";
import { useLaunches } from "../../hooks/useLaunches";
import PaginationCont from "../PaginationCont/PaginationCont";
import usePagination from "../../hooks/usePagination";

const CardListContainer = () => {
  const { combinedData, loading, searchTerm, setSearchTerm } = useLaunches();
  const pageSize = 9;

  const filteredLaunches = combinedData.filter((launch) =>
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
        {loading ? (
          <Loading />
        ) : getCurrentPageData().length === 0 ? (
          <Typography color={"white"} variant="body1">
            No se encontraron resultados.
          </Typography>
        ) : (
          getCurrentPageData().map((launch) => (
            <Grid
              padding={"0"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              item
              key={launch.id}
            >
              <CardList
                launch={launch}
                rocket={launch.rocket}
                loading={loading}
              />
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

export default CardListContainer;

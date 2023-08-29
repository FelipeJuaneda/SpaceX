import { Box, Grid, Typography } from "@mui/material";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import SearchBar from "../../components/SearchBar/SearchBar";
import CardList from "../../components/CardList/CardList";
import { useLaunches } from "../../hooks/useLaunches";
import PaginationCont from "../../components/PaginationCont/PaginationCont";
import usePagination from "../../hooks/usePagination";
import TotalResults from "../../components/TotalResults/TotalResults";

const CardListContainer = () => {
  const { combinedData, loading, searchTerm, setSearchTerm } = useLaunches();
  const [listRef] = useAutoAnimate();
  const pageSize = 9;
  const filteredLaunches = combinedData.filter((launch) =>
    launch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const { totalPageCount, getCurrentPageData, handlePageChange, currentPage } =
    usePagination(filteredLaunches, pageSize);

  return (
    <Box>
      <SearchBar setSearchTerm={setSearchTerm} />
      <TotalResults results={filteredLaunches.length} />
      <Grid
        ref={listRef}
        padding={"0 30px"}
        overflow={"hidden"}
        marginTop={0}
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
          <LoadingSpinner />
        ) : getCurrentPageData().length === 0 ? (
          <Typography color={"white"} variant="body1">
            No results found.
          </Typography>
        ) : (
          getCurrentPageData().map((launch) => (
            <Grid padding={0} xs={12} sm={6} md={4} lg={3} item key={launch.id}>
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

import { useLaunches } from "../../hooks/useLaunches";
import CardList from "../CardList/CardList";
import { Grid } from "@mui/material";
import { Loading } from "../Loading/Loading";
// import Card from "../Card/Card";
// import { Box } from "@mui/material";

const CardListContainer = () => {
  const { combinedData, loading } = useLaunches();
  console.log("combinada", combinedData);

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
      {loading ? (
        <Loading />
      ) : (
        combinedData.map((launch) => (
          <Grid padding={"0"} xs={12} sm={6} md={4} lg={3} item key={launch.id}>
            <CardList
              launch={launch}
              rocket={launch.rocket}
              loading={loading}
            />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default CardListContainer;

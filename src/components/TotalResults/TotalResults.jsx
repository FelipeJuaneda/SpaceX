import { Box, Typography } from "@mui/material";

const TotalResults = ({ results }) => {
  return (
    <Box sx={{ padding: "15px 30px", backgroundColor: "#121212" }}>
      <Typography sx={{ color: "#ffffff78" }}>Total ({results})</Typography>
    </Box>
  );
};

export default TotalResults;

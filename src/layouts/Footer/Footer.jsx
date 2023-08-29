import { Box, Container, Grid, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        background: "linear-gradient(180deg, #1E1E1E 0%, #121212 35.89%)",
        boxShadow:
          "1px 20px 0px 0px rgba(0, 0, 0, 0.14), -1px -20px 20px 15px rgba(0, 0, 0, 0.12), 0px -6px 9px 5px rgba(0, 0, 0, 0.2)",
        padding: "1rem 0", // Ajuste el padding para dispositivos móviles

        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <Container maxWidth="lg">
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography color="#FFFFFF" variant="h5" align="center">
              Space X
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="#FFFFFF" variant="subtitle1" align="center">
              {`${new Date().getFullYear()} | React Js | Material UI | React Router`}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;

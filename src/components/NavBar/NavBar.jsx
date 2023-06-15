import { Typography, createTheme, ThemeProvider, Box } from "@mui/material";
import logo from "../../assets/logoSpaceX.svg";
import { NavLink } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
  components: {
    MuiTypography: {
      variants: [
        {
          props: { variant: "h2" },
          style: {
            fontSize: "32px",
            lineHeight: "48px",
            letterSpacing: "4%",
          },
        },
        {
          props: { variant: "caption" },
          style: {
            fontSize: "20px",
            lineHeight: "48px",
            letterSpacing: "4%",
          },
        },
      ],
    },
  },
});

const navBarStyles = {
  root: {
    background: "linear-gradient(180deg, #121212 64.11%, #1E1E1E 100%)",
    boxShadow:
      "0px 8px 10px rgba(0, 0, 0, 0.14), 0px 3px 14px rgba(0, 0, 0, 0.12), 0px 5px 5px rgba(0, 0, 0, 0.2)",
    padding: "0 30px",
  },
  logoContainer: {
    padding: "20px 0",
    textAlign: "center",
  },
  launchesText: {
    padding: "10px 0",
  },
  menuContainer: {
    display: "flex",
    fontFamily: "DIN Next LT Pro",
    fontSize: "36px",
    lineHeight: "48px",
    gap: "20px",
  },
  menuItem: {
    width: "180px",
    fontFamily: "DIN Next LT Pro",
    fontSize: "20px",
    lineHeight: "32px",
    paddingTop: "10px",
    textAlign: "center",
  },
};

const NavBar = () => {
  const menu = [
    { value: "All", to: "/", id: 1 },
    { value: "Favourites", to: "/favorites", id: 2 },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={navBarStyles.root}>
        <Box sx={navBarStyles.logoContainer}>
          <img
            style={{ width: "246px", height: "30px" }}
            src={logo}
            alt="Logo de Space X"
          />
        </Box>
        <Box>
          <Typography
            variant="h2"
            color="secondary"
            sx={navBarStyles.launchesText}
          >
            Launches
          </Typography>
        </Box>
        <Box sx={navBarStyles.menuContainer}>
          {menu.map((nav) => {
            return (
              <NavLink
                key={nav.id}
                className={"navLink"}
                style={{
                  textDecoration: "none",
                  width: "100px",
                  textAlign: "center",
                }}
                activeclassname={{ borderBottom: "2px solid white;" }}
                to={nav.to}
              >
                <Typography
                  variant="caption"
                  color="white"
                  sx={navBarStyles.menuItem}
                >
                  {nav.value}
                </Typography>
              </NavLink>
            );
          })}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default NavBar;

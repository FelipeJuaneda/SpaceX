import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import { useLaunchDetails } from "../../hooks/useLaunchDetail";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import FavoriteButton from "../../components/FavoriteButton/FavoriteButton";
import AboutThisLaunch from "./AboutThisLaunch";

const LauncherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { combinedDataDetail } = useLaunchDetails(id);

  const goBack = () => {
    navigate(-1);
  };

  if (!combinedDataDetail) {
    return <LoadingSpinner />;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };
  const formattedDate = formatDate(combinedDataDetail.date_local);

  return (
    <Box>
      <Box>
        <Box
          sx={{
            background: "#121212",
            width: "100%",
            height: "350px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url(${combinedDataDetail.rocket?.flickr_images[0]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              maskImage:
                "linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
              maskPosition: "bottom",
              maskRepeat: "no-repeat",
            }}
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            position="absolute"
            fontSize={"24px"}
            top="25px"
            width="100%"
            color={"white"}
          >
            <Link to={"/"} onClick={goBack}>
              <Avatar
                sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)", margin: "0 20px" }}
              >
                <IoIosArrowBack />
              </Avatar>
            </Link>
            <FavoriteButton
              id={combinedDataDetail.id}
              launch={combinedDataDetail}
              style={true}
            />
          </Stack>
          <Stack
            justifyContent="center"
            alignItems="center"
            sx={{
              position: "absolute",
              bottom: "15%",
              left: "0",
              right: "0",
              color: "rgba(255, 255, 255, 0.87)",
            }}
          >
            <Stack>
              <Typography sx={{ fontSize: "14px" }}>{formattedDate}</Typography>
              <Typography
                sx={{
                  fontSize: "40px",
                  fontWeight: 700,
                  lineHeight: "56px",
                  letterSpacing: "0.04em",
                }}
              >
                {combinedDataDetail.name}
              </Typography>
              <Typography>
                {combinedDataDetail.details
                  ? combinedDataDetail.details
                  : "First orbital class rocket capable of reflight"}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>
      <Box
        sx={{
          background:
            "linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), #121212;",
          width: "100%",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          divider={<Divider color="grey" orientation={"horizontal"} flexItem />}
          spacing={4}
          height={{ xs: "100%", sm: "100px" }}
          color={"white"}
          justifyContent={"center"}
          textAlign="center"
          alignItems={"center"}
          padding={{ xs: "15px 0" }}
        >
          {[
            { n: 122, text: "TOTAL LAUNCHES" },
            { n: 82, text: "TOTAL LANDINGS" },
            { n: 64, text: "TOTAL ROCKETS" },
          ].map((element, index) => {
            return (
              <Stack key={index} alignItems={"center"}>
                <span>{element.n}</span>
                <Typography>{element.text}</Typography>
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <AboutThisLaunch combinedDataDetail={combinedDataDetail} />
    </Box>
  );
};

export default LauncherDetail;

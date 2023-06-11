import { Link, useNavigate, useParams } from "react-router-dom";
import { useLaunchDetails } from "../../hooks/useLaunchDetail";
import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import naveDetail from "../../assets/naveDetail.svg";
import { Loading } from "../Loading/Loading";
import FavoriteButton from "../FavoriteButton/FavoriteButton";

const LauncherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { launchDetails, rocketDetails } = useLaunchDetails(id);

  const goBack = () => {
    navigate(-1);
  };

  if (!launchDetails || !rocketDetails) {
    return <Loading />;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };
  const formattedDate = formatDate(launchDetails.date_local);

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
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url(${rocketDetails?.flickr_images[0]})`,
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
            <Link onClick={goBack}>
              <Avatar
                sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)", margin: "0 20px" }}
              >
                <IoIosArrowBack />
              </Avatar>
            </Link>
            <FavoriteButton
              id={launchDetails.id}
              launch={launchDetails}
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
                {launchDetails.name}
              </Typography>
              <Typography>
                {launchDetails.details
                  ? launchDetails.details
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
          direction="row"
          divider={<Divider color="grey" orientation="vertical" flexItem />}
          spacing={4}
          height={"150px"}
          color={"white"}
          justifyContent={"center"}
          alignItems={"center"}
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
      <Box sx={{ paddingTop: "50px", background: "#121212" }}>
        <Stack color={"white"} justifyContent={"center"} alignItems={"center"}>
          <Typography>ABOUT THIS LAUNCH</Typography>
          <Typography variant="subtitle1">
            {launchDetails.details ||
              "First orbital class rocket capable of reflight"}
          </Typography>

          <Stack
            marginTop={"40px"}
            width={"70%"}
            flexDirection={"row"}
            alignItems={"center"}
          >
            <Stack width={"100%"}>
              <Typography textAlign={"start"} paddingBottom={"20px"}>
                OVERVIEW
              </Typography>
              <Stack
                direction="column"
                divider={
                  <Divider color="grey" orientation="horizontal" flexItem />
                }
                spacing={1}
              >
                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                  <Typography>HEIGHT </Typography>{" "}
                  <Typography>
                    {rocketDetails.height.meters}m / {rocketDetails.height.feet}
                    ft
                  </Typography>
                </Stack>
                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                  <Typography>DIAMETER </Typography>{" "}
                  <Typography>
                    {rocketDetails.diameter.meters}m /{" "}
                    {rocketDetails.diameter.feet}ft
                  </Typography>
                </Stack>
                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                  <Typography>MASS </Typography>{" "}
                  <Typography>
                    {rocketDetails.mass.kg}kg / {rocketDetails.mass.lb}lb
                  </Typography>
                </Stack>
                {rocketDetails.payload_weights.map((element, index) => (
                  <Stack
                    key={index}
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                  >
                    <Typography>
                      PAYLOAD TO {element.id.toUpperCase()}{" "}
                    </Typography>
                    <Typography>
                      {element.kg}kg / {element.lb}lb
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
            <Stack width={"400px"}>
              <img width={"100%"} src={naveDetail} alt="" />
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default LauncherDetail;

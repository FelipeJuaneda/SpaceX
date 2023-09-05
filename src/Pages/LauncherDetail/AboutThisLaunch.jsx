import { Box, Divider, Stack, Typography } from "@mui/material";
import naveDetail from "../../assets/naveDetail.svg";

const AboutThisLaunch = ({ combinedDataDetail }) => {
  return (
    <Box sx={{ paddingTop: "50px", background: "#121212" }}>
      <Stack color={"white"} justifyContent={"center"} alignItems={"center"}>
        <Typography>ABOUT THIS LAUNCH</Typography>
        <Typography
          sx={{ padding: "0 20px", textAlign: "center" }}
          variant="subtitle1"
        >
          {combinedDataDetail.details ||
            "First orbital class rocket capable of reflight"}
        </Typography>

        <Stack
          marginTop={"40px"}
          width={{ xs: "100%", sm: "70%" }}
          flexDirection={{ xs: "column", md: "row" }}
          alignItems={"center"}
        >
          <Stack width={{ xs: "100%", md: "90%" }}>
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
                  {combinedDataDetail.rocket?.height.meters}m /{" "}
                  {combinedDataDetail.rocket?.height.feet}
                  ft
                </Typography>
              </Stack>
              <Stack flexDirection={"row"} justifyContent={"space-between"}>
                <Typography>DIAMETER </Typography>{" "}
                <Typography>
                  {combinedDataDetail.rocket?.diameter.meters}m /{" "}
                  {combinedDataDetail.rocket?.diameter.feet}ft
                </Typography>
              </Stack>
              <Stack flexDirection={"row"} justifyContent={"space-between"}>
                <Typography>MASS </Typography>{" "}
                <Typography>
                  {combinedDataDetail.rocket?.mass.kg}kg /{" "}
                  {combinedDataDetail.rocket?.mass.lb}lb
                </Typography>
              </Stack>
              {combinedDataDetail.rocket?.payload_weights.map(
                (element, index) => (
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
                )
              )}
            </Stack>
          </Stack>
          <Stack width={{ xs: "200px", md: "500px" }}>
            <img width={"100%"} src={naveDetail} alt="launch detail image" />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AboutThisLaunch;

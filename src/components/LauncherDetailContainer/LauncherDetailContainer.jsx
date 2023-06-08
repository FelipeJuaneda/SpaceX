import { useParams } from "react-router-dom";
import { useLaunchDetails } from "../../hooks/useLaunchDetail";

const LauncherDetailContainer = () => {
  const { id } = useParams();
  const { launchDetails, rocketDetails } = useLaunchDetails(id);
  console.log("launch", launchDetails);
  console.log("rocket", rocketDetails);
  return <div>LauncherDetailContainer</div>;
};

export default LauncherDetailContainer;

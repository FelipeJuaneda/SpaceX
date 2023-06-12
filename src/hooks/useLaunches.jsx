import { useEffect, useState } from "react";

const API_URL = "https://api.spacexdata.com";
export function useLaunches() {
  const [responseLaunches, setResponseLaunches] = useState([]);
  const [responseRockets, setResponseRockets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getLaunches = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/v5/launches`);
        const data = await response.json();
        setResponseLaunches(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const getRockets = async () => {
      try {
        const response = await fetch(`${API_URL}/v4/rockets`);
        const data = await response.json();
        setResponseRockets(data);
      } catch (error) {
        console.log(error);
      }
    };

    getLaunches();
    getRockets();
  }, []);

  const combineLaunchesAndRockets = () => {
    return responseLaunches.map((launch) => {
      const rocket = responseRockets.find(
        (rocket) => rocket.id === launch.rocket
      );
      return {
        ...launch,
        rocket: rocket || null,
      };
    });
  };
  const combinedData = combineLaunchesAndRockets();

  return {
    responseLaunches,
    responseRockets,
    combinedData,
    loading,
    setSearchTerm,
    searchTerm,
  };
}

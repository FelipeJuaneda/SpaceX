import { useState, useEffect } from "react";

const API_URL = "https://api.spacexdata.com";

export function useLaunchDetails(launchId) {
  const [launchDetails, setLaunchDetails] = useState(null);
  const [rocketDetails, setRocketDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLaunchDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/v5/launches/${launchId}`);
        const data = await response.json();
        setLaunchDetails(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchDetails();
  }, [launchId]);

  useEffect(() => {
    const fetchRocketDetails = async () => {
      if (launchDetails && launchDetails.rocket) {
        try {
          setLoading(true);
          const response = await fetch(
            `${API_URL}/v4/rockets/${launchDetails.rocket}`
          );
          const data = await response.json();
          setRocketDetails(data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRocketDetails();
  }, [launchDetails]);

  return { launchDetails, rocketDetails, loading };
}

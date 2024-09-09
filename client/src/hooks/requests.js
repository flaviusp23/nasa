import axios from 'axios';

// Define base URL from environment variable
const BASE_URL = `${window.location.origin}/v1`;

async function httpGetPlanets() {
  try {
    const response = await axios.get(`${BASE_URL}/planets`);
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function httpGetLaunchesUpcoming(page = 1, limit = 5) {
  try {
    const response = await axios.get(`${BASE_URL}/launches/upcoming`, {
      params: { page, limit },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function httpGetLaunchesHistory(page = 1, limit = 5) {
  try {
    const response = await axios.get(`${BASE_URL}/launches/history`, {
      params: { page, limit },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function httpSubmitLaunch(launch) {
  try {
    const response = await axios.post(`${BASE_URL}/launches`, launch, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (err) {
    console.error(err);
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/launches/${id}`);
    return response;
  } catch (err) {
    console.error(err);
    return {
      ok: false,
    };
  }
}

export {
  httpGetPlanets,
  httpSubmitLaunch,
  httpAbortLaunch,
  httpGetLaunchesUpcoming,
  httpGetLaunchesHistory,
};

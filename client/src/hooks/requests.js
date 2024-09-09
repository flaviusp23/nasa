// Define base URL from environment variable
const BASE_URL = `${window.location.origin}/v1`;

async function httpGetPlanets() {
  const response = await fetch(`${BASE_URL}/planets`);
  return await response.json();
}

async function httpGetLaunchesUpcoming(page = 1, limit = 5) {
  const response = await fetch(`${BASE_URL}/launches/upcoming?page=${page}&limit=${limit}`);
  const fetchedLaunchesUpcoming = await response.json();
  return fetchedLaunchesUpcoming;
}

async function httpGetLaunchesHistory(page = 1, limit = 5) {
  const response = await fetch(`${BASE_URL}/launches/history?page=${page}&limit=${limit}`);
  const fetchedLaunchesHistory = await response.json();
  return fetchedLaunchesHistory;
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${BASE_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch(err) {
    console.log(err);
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${BASE_URL}/launches/${id}`, {
      method: "delete",
    });
  } catch(err) {
    console.log(err);
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
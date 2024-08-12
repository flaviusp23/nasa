const API_URL = 'http://localhost:8000/v1'

async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  return await response.json();
}

async function httpGetLaunchesUpcoming() {
  const response = await fetch(`${API_URL}/launches/upcoming`);
  const fetchedLaunchesUpcoming = await response.json();
  return fetchedLaunchesUpcoming
}

async function httpGetLaunchesHistory() {
  const response = await fetch(`${API_URL}/launches/history`);
  const fetchedLaunchesHistory = await response.json();
  return fetchedLaunchesHistory
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
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
  try{
    return await fetch(`${API_URL}/launches/${id}`,{
      method:"delete",
    });
  }
  catch(err){
    console.log(err)
    return{
      ok: false,
    }
  }
  
}

export {
  httpGetPlanets,
  httpSubmitLaunch,
  httpAbortLaunch,
  httpGetLaunchesUpcoming,
  httpGetLaunchesHistory,
};
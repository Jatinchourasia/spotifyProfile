import axios from "axios";

const LOCALSTORAGE_KEYS = {
  accessToken: "spotifyAccessToken",
  refreshToken: "spotifyRefreshToken",
  expireTime: "spotifyTokenExpireTime",
  timeStamp: "spotifyTokenTimeStamp",
};
const LOCALSTORAGE_VALUE = {
  accessToken: localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timeStamp: localStorage.getItem(LOCALSTORAGE_KEYS.timeStamp),
};

// Logout
export const logout = () => {
  for (const property in LOCALSTORAGE_KEYS) {
    localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }
  location = location.origin;
};

const hasTokenExpired = () => {
  const { accessToken, timeStamp, expireTime } = LOCALSTORAGE_VALUE;
  if (!accessToken || !timeStamp) {
    return false;
  }
  // cuttent time - time spent time
  const timeSpent = Date.now() - Number(timeStamp);
  //  if total time stemp is over time limit it will return true

  return timeSpent / 1000 > Number(expireTime);
};

const refreshToken = async () => {
  try {
    // logout if no refresh token
    if (
      LOCALSTORAGE_VALUE.refreshToken ||
      LOCALSTORAGE_VALUE.refreshToken === "undefined" ||
      Date.now() - Number(LOCALSTORAGE_VALUE.timeStamp) / 1000 < 1000
    ) {
      console.error("no refresh token available");
      logout();
    }

    // using end point from node server
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${LOCALSTORAGE_VALUE.refreshToken}`
    );
    localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token);
    localStorage.setItem(LOCALSTORAGE_KEYS.timeStamp, Date.now());
    location.reload();
  } catch (e) {
    console.error(e);
  }
};

const getAccessToken = () => {
  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get("access_token"),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get("access_token"),
    [LOCALSTORAGE_KEYS.expireToken]: urlParams.get("access_token"),
  };
  const hasError = urlParams.get("error");

  //   error or token expired
  if (
    hasError ||
    hasTokenExpired() ||
    LOCALSTORAGE_VALUE.accessToken === "undefined"
  ) {
    refreshToken();
  }
  // if there is valid access token in localstorege
  if (
    LOCALSTORAGE_VALUE.accessToken &&
    LOCALSTORAGE_VALUE.accessToken !== "undefined"
  ) {
    return LOCALSTORAGE_VALUE.accessToken;
  }

  // for first time login setting val in localstorage
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    for (const property in queryParams) {
      localStorage.setItem(property, queryParams[property]);
    }
    // set time stamp
    localStorage.setItem(LOCALSTORAGE_KEYS.timeStamp, Date.now());
    // return access token
    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }
  return false;
};

export const accessToken = getAccessToken();

// AXIOS global HEaders
axios.defaults.baseURL = "https://api.spotify.com/v1";
axios.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
axios.defaults.headers["Content-Type"] = "application/json";

// API CALlS

export const getCurrentUserProfile = () => axios.get("/me");

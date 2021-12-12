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

// API CALlS

// AXIOS global HEaders
const headers = {
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
};

// get User
export const getUser = () =>
  axios.get("https://api.spotify.com/v1/me", { headers });
// following artist
export const getFollowing = () =>
  axios.get("https://api.spotify.com/v1/me/following?type=artist", { headers });

// recently played
export const getRecentlyPlayed = () =>
  axios.get("https://api.spotify.com/v1/me/player/recently-played", {
    headers,
  });
// playlist
export const getPlaylists = () =>
  axios.get("https://api.spotify.com/v1/me/playlists", { headers });

// top artist

// last  month

export const getTopArtistsShort = () =>
  axios.get(
    "https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term",
    {
      headers,
    }
  );

// last 6 month

export const getTopArtistsMedium = () =>
  axios.get(
    "https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term",
    {
      headers,
    }
  );
// All time

export const getTopArtistsLong = () =>
  axios.get(
    "https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term",
    { headers }
  );

// top tracks
// last month
export const getTopTracksShort = () =>
  axios.get(
    "https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term",
    { headers }
  );
// last 6 month

export const getTopTracksMedium = () =>
  axios.get(
    "https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term",
    {
      headers,
    }
  );
// All time
export const getTopTracksLong = () =>
  axios.get(
    "https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term",
    { headers }
  );

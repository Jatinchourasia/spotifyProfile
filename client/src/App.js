import React, { useEffect, useState } from "react";
import { accessToken, getCurrentUserProfile, logout } from "./spotify";

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    setToken(accessToken);
    const fetchUserData = async () => {
      try {
        const { data } = await getCurrentUserProfile();
        setProfile(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchUserData();

    console.log(profile);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {!token ? (
          <a
            className="App-link"
            href="http://localhost:8080/login"
            rel="noopener noreferrer"
          >
            Login
          </a>
        ) : (
          <div className="">
            {profile && <h1>{profile.display_name} you are loggedIn</h1>}
            <h2 onClick={logout}>Logout</h2>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";

const MyComponent = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .post("https://q-tenant.vdotok.dev/API/v0/Login", {
        project_id: "1RN1RP",
        email: "david@test.com",
        password: "password",
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    if (user !== null) {
      initializeSDK();
    }
  }, [user]);

  const initializeSDK = () => {
    // Access the state data immediately after setting it
    console.log(user);

    // connect client to server
    console.log("user: " + JSON.stringify(user));
    let params = {
      projectId: "23SBP2Y",
      host: "wss://q-signalling.vdotok.dev:8443/call",
      stunServer: "r-stun1.vdotok.dev:3478",
    };
    let client = new CVDOTOK.Client(params);

    client.on("connected", (res) => {
      // setConnect(true)
      // console.log("sdk connected", res);
      console.log(
        JSON.stringify(user),
        "<----------------------------------------------------------------"
      );
      client.Register(user.authorization_token, user.ref_id);
      client.on("register", (response) => {
        console.log("register", response);
      });
    });
  };

  return <div>adf</div>;
};

export default MyComponent;

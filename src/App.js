import React, { useEffect, useState } from "react";
// import VDOTOK from "./constants/vdotok-call.js";
import axios from "axios";
const App = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    fetchLogin();
  }, []);

  const fetchLogin = () => {
    axios
      .post("https://q-tenant.vdotok.dev/API/v0/Login", {
        projectId: "1RN1RP",
        email: "david@test.com",
        password: "password",
      })
      .then((res) => {
        console.log("res aftrer login", res);
        setUser(res.data);
        initializeSDK();
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  };

  let initializeSDK = () => {
    console.log(user, "fasdfasfasfas");

    // connect client to server
    // console.log("user: " + JSON.stringify(user));
    // let params = {
    //   projectId: "23SBP2Y",
    //   host: "wss://q-signalling.vdotok.dev:8443/call",
    //   stunServer: "r-stun1.vdotok.dev:3478",
    // };
    // let client = new CVDOTOK.Client(params);

    // client.on("connected", (res) => {
    //   // setConnect(true)
    //   // console.log("sdk connected", res);
    //   console.log(
    //     JSON.stringify(user),
    //     "<----------------------------------------------------------------"
    //   );
    //   client.Register(user.authorization_token, user.ref_id);
    //   client.on("register", (response) => {
    //     console.log("register", response);
    //   });
    // });
  };

  return (
    <>
      <div>hi there</div>
      <div>user:{/*{user ? `${JSON.stringify(user)}` : ""}**/}</div>
    </>
  );
};

export default App;

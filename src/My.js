import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const MyComponent = () => {
  const [user, setUser] = useState(null);
  const [Client, setClient] = useState(null);
  const videoRef = useRef(null);

  // fetching user login
  useEffect(() => {
    const fetchData = () => {
      axios
        .post("https://q-tenant.vdotok.dev/API/v0/Login", {
          project_id: "1RN1RP",
          email: "dataMine",
          password: "password",
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
    fetchData();
  }, []);

  const startCamera = () => {
    document.getElementById("localVideo").style.display = "block";

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      document.getElementById("localVideo").style.display = "none";
      Client.Disconnect();
      setClient(null);
    }
  };

  //initializingSDK
  useEffect(() => {
    if (user !== null) {
      initializeSDK();
    }
  }, [user]);

  //onRegister enable camera
  useEffect(() => {
    if (Client !== null) {
      Client.on("register", (response) => {
        // console.log("register", response);
        startCamera();
        console.log("sdk connected...");
      });
    }
  }, [Client]);

  const initializeSDK = () => {
    console.log("connecting SDK to the SERVE ..................");
    console.log("user: " + JSON.stringify(user));
    let params = {
      projectId: "1RN1RP",
      host: user.media_server_map.complete_address,
      stunServer: user.stun_server_map.complete_address,
    };

    // connect client to server
    let client = new CVDOTOK.Client(params);
    setClient(client);

    client.on("connected", (res) => {
      // console.log(
      //   JSON.stringify(res),
      //   "<----------------------------------------------------------------"
      // );
      client.Register(user.ref_id, user.authorization_token);
      console.log("connecting SDK********************************");

      // error handling
      client.on("error", (res) => {
        console.log("sdk error in app: ", res);
        //
        if (res.type === "NO_STREAM_GOT") {
        } else if (res.type === "INVALID_INITIALIZATION_ARGUMENTS") {
          this.setState({ sdkConnected: false });
        } else if (res.type === "INVALID_HOST_PATTERN") {
          this.setState({ sdkConnected: false });
        } else if (res.type === "SOCKET_CLOSED") {
          this.setState({ sdkConnected: false });
        } else if (res.type === "REGISTER_RESPONSE") {
          this.setState({ sdkConnected: false });
        }

        // setErr(res.message)
        console.log("error****************", res.message);
        // alert(res.message)
      });
    });

    client.on("disconnect", (response) => {
      //on disconnecting
      stopCamera();
    });
  };

  const initiateCall = () => {
    if (Client !== null) {
      // const params = {
      //   localVideo: '',
      //   remoteVideo: '',
      //   audio: 0,
      //   video: 1,
      //   videoType: 'camera',
      //   to: 'receiver/calee name'
      // }
      const params = {
        localVideo: document.getElementById("localVideo"),
        remoteVideo: document.getElementById("remoteVideo"),
        video,
        audio,
        videoType: video ? "camera" : "audio",
        to: [user.ref_id],
        timeout: 40,
        isPeer: 1,
      };
      Client.call();
    }
  };

  return (
    <>
      <video
        id="localVideo"
        className="localVideo"
        ref={videoRef}
        autoPlay
        muted
        playsInline
      />
      <video
        id="remoteVideo"
        className="remoteVideo"
        ref={videoRef}
        autoPlay
        muted
        playsInline
      />
      <div>
        <button onClick={initializeSDK}>Start Camera</button>
        <button onClick={stopCamera}>Stop Camera</button>
      </div>
    </>
  );
};

export default MyComponent;

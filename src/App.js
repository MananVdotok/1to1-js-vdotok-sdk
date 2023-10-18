import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const MyComponent = () => {
  const [user, setUser] = useState(null);
  const [Client, setClient] = useState(null);
  const [loading, setLoading] = useState("initiating");
  const videoRef = useRef(null);

  // fetching user login
  useEffect(() => {
    const fetchData = () => {
      axios
        .post("https://q-tenant.vdotok.dev/API/v0/Login", {
          project_id: "127OUKED",
          email: "manan",
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
    document.querySelector(".Container").style.display = "flex";
    document.querySelector(".dummy").style.display = "none";

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

      // setClient(null);
    }

    document.querySelector(".Container").style.display = "none";
    document.querySelector(".dummy").style.display = "flex";
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
        setLoading("Socket Connected");
        console.warn(
          loading,
          "================================================"
        );
        console.log("sdk connected...");
      });
    }
  }, [Client]);

  const initializeSDK = () => {
    console.log("connecting SDK to the SERVE ..................");
    console.log("user: " + JSON.stringify(user));
    let params = {
      projectId: "127OUKED",
      host: user.media_server_map.complete_address,
      stunServer: user.stun_server_map.complete_address,
      ignorePublicIP: true,
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
      setLoading("connecting");
      console.warn(loading, "=====");
      console.log("connecting SDK********************************");

      // error handling
      client.on("error", (res) => {
        console.log("sdk error in app:_______________ ", res.type);

        // setErr(res.message)
        console.log("error****************", res.message);
        // alert(res.message)
      });
    });

    client.on("close ", (response) => {
      //on disconnecting
      console.log("disconnect", response);
      setLoading("Socket Disconnected");
      console.warn(loading, "=====");
      stopCamera();
    });
    // client.on("disconnect", (response) => {
    //   console.log("disconnect", response);
    //   setLoading("Socket Disconnected");
    //   console.warn(loading, "=====");
    //   stopCamera();
    // });

    client.on("call", (response) => {
      console.log("call-------------------------", response);
      //////////////////
      //// caller case when someone makes a call
      if (response.type == "TRYING") {
        // when server trying to search receiver
        console.log("Trying to call--------------------");
      } else if (response.type == "CONNECTING") {
        // when vidtok server connecting to the receiver
        console.log("connecting to call--------------------");
      } else if (response.type == "ALERTING") {
        // when your call is transferring to the receiver and receiver is being informed
        console.log("Alerting to call--------------------");
      } else if (response.type == "CALL_ACCEPTED") {
        // when your call is attended by receiver
        console.log("call Accepted--------------------");
      } else if (response.type == "CALL_REJECTED") {
        end_Call();
        stopCamera();
        // when your call is rejected by receiver
        console.log("call Rejected--------------------");
      } else if (response.type == "CALL_ENDED") {
        // when call is ended both receives this event
        end_Call();
        stopCamera();
        console.log("call Ended--------------------");
      } else if (response.type == "CALL_RECEIVED") {
        stopCamera();
        // when call is ended both receives this event
        console.log("CALL_RECEIVED--------------------");
      } else if (response.type == "MISSED_CALL") {
        // when call is ended both receives this event
        console.log("MISSED_CALL--------------------");
      } else if (response.type == "drop") {
        console.log("DROP_CALL--------------------");
      } else if (response.type == "SOCKET_DROPPED") {
        console.warn("DROP_CALL--------------------");
        setLoading("Socket Disconnected");
        console.warn(loading, "=====");
        stopCamera();
      }
    });
  };

  const initiateCall = () => {
    if (Client !== null && !videoRef.current.srcObject) {
      // const params = {
      //   localVideo: '',
      //   remoteVideo: '',
      //   audio: 0,
      //   video: 1,
      //   videoType: 'camera',
      //   to: 'receiver/calee name'
      // }
      startCamera();
      const params = {
        localVideo: document.getElementById("localVideo"),
        remoteVideo: document.getElementById("remoteVideo"),
        video: 1,
        audio: 1,
        videoType: "camera",
        // ref_id
        to: ["127OUKED4d7263ef12b7cd2f0679f8bcccc43e97"],
        timeout: 40,
        isPeer: 0,
      };
      Client.Call(params);
    }
  };

  const end_Call = () => {
    if (Client !== null) {
      Client.EndCall();
    }
  };

  return (
    <>
      <div className="parent">
        <div className="dummy">
          <span>{`${loading} `}</span>
          <div className="dataLoading"></div>
        </div>
        {/* camera viewport */}
        <div className="Container">
          <video
            id="localVideo"
            className="localVideo"
            ref={videoRef}
            autoPlay
            playsInline
          />
          <div className="videoContainer">
            <video
              id="remoteVideo"
              className="remoteVideo"
              autoPlay
              playsInline
            />
          </div>
        </div>
        {/* control  buttons */}
        <div className="buttons-container">
          <button className="button" id="button-3" onClick={initializeSDK}>
            <div id="circle"></div>
            <div className="anchor">connectScoket</div>
          </button>
          <button
            className="button"
            id="button-3"
            onClick={() => {
              Client.Disconnect();
              stopCamera();
              setLoading("Disconnect");
            }}
          >
            <div id="circle"></div>
            <div className="anchor">Disconnect Socket</div>
          </button>
          <button className="button" id="button-3" onClick={initiateCall}>
            <div id="circle"></div>
            <div className="anchor">Start Call</div>
          </button>
          <button
            className="button"
            id="button-3"
            onClick={() => {
              end_Call();
              stopCamera();
            }}
          >
            <div id="circle"></div>
            <div className="anchor">End Call</div>
          </button>
        </div>
      </div>
    </>
  );
};

export default MyComponent;

import * as faceapi from "face-api.js";
import React, { useState, useEffect } from "react";

function App() {
  const [stop, setStop] = useState(false);
  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(false);

  const videoRef = React.useRef();
  const videoHeight = 480;
  const videoWidth = 640;
  const canvasRef = React.useRef();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(setModelsLoaded(true));
    };
    loadModels();
  }, []);

  const startVideo = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  let points = 100;

  let lookLeft = false;
  let lookRight = false;

  let looked = true; //true -> up, false -> down

  let midLine = 0;
  let chinLine = 0;

  let polls = 1;
  const maxPolls = 20;
  let calcAvg = false;
  let calibration = true;

  function calibrate() {
    midLine = 0;
    chinLine = 0;

    polls = 1;
    calcAvg = false;
    calibration = true;

    console.log("calibrating");
  }

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
          videoRef.current
        );
        const displaySize = {
          width: videoWidth,
          height: videoHeight,
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);

        faceapi.detectFaceLandmarks(
          videoRef.current,
          new faceapi.FaceLandmark68Net()
        );
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks();
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        if (resizedDetections[0]) {
          const landmarks = resizedDetections[0].landmarks.positions;

          if (calibration) {
            midLine += landmarks[31].x;
            chinLine += landmarks[9].y;
            polls++;

            if (polls > maxPolls) {
              calibration = false;
            }
          } else if (!calcAvg) {
            midLine /= maxPolls;
            chinLine /= maxPolls;

            calcAvg = true;
          }

          if (calcAvg) {
            if (landmarks[31].x < midLine - 30) {
              lookLeft = true;
            }

            if (landmarks[31].x > midLine + 30) {
              lookRight = true;
            }

            looked = landmarks[58].y < chinLine + 30;
          }

          console.log(points);
          if (!looked) {
            points -= 0.5;
          }

          if (lookLeft && lookRight) {
            alert("You looked both ways!");
            lookLeft = false;
            lookRight = false;
          }

          canvasRef &&
            canvasRef.current &&
            canvasRef.current
              .getContext("2d")
              .clearRect(0, 0, videoWidth, videoHeight);
          canvasRef &&
            canvasRef.current &&
            faceapi.draw.drawFaceLandmarks(
              canvasRef.current,
              resizedDetections
            );
        }
      }
    }, 100);
  };

  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks()[0].stop();
    setCaptureVideo(false);
  };

  return (
    <div>
      <div style={{ textAlign: "center", padding: "10px" }}>
        {captureVideo && modelsLoaded ? (
          <button
            onClick={closeWebcam}
            style={{
              cursor: "pointer",
              backgroundColor: "green",
              color: "white",
              padding: "15px",
              fontSize: "25px",
              border: "none",
              borderRadius: "10px",
            }}
          >
            Close Webcam
          </button>
        ) : (
          <button
            onClick={startVideo}
            style={{
              cursor: "pointer",
              backgroundColor: "green",
              color: "white",
              padding: "15px",
              fontSize: "25px",
              border: "none",
              borderRadius: "10px",
            }}
          >
            Open Webcam
          </button>
        )}
      </div>
      {captureVideo ? (
        modelsLoaded ? (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              <video
                ref={videoRef}
                height={videoHeight}
                width={videoWidth}
                onPlay={handleVideoOnPlay}
                style={{ borderRadius: "10px" }}
              />
              <canvas ref={canvasRef} style={{ position: "absolute" }} />
            </div>
          </div>
        ) : (
          <div>loading...</div>
        )
      ) : (
        <></>
      )}
      <button
        onClick={() => {
          calibrate();
        }}
      >
        Calibrate
      </button>
    </div>
  );
}

export default App;

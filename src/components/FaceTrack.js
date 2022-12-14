import * as faceapi from "face-api.js";
import React, { useState, useEffect } from "react";
import { usePenaltyContext } from "../PenaltyContext";

export default function FaceTrack() {
  const {
    focus,
    setFocus,
    setLookedLR,
    deductFocus,
    setAwareness,
    setSpeedPenalty,
    reset
  } = usePenaltyContext();

  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(false);

  const videoRef = React.useRef();
  const videoHeight = 300;
  const videoWidth = 300;
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
    reset();
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300, height: 300 } })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  let lookLeft = false;
  let lookRight = false;

  let lookedDown = false; //true -> down, false -> up

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
              console.log("looked left");
              lookLeft = true;
            }

            if (landmarks[31].x > midLine + 30) {
              console.log("looked right");
              lookRight = true;
            }

            lookedDown = landmarks[58].y > chinLine;
          }

          if (lookedDown) {
            console.log("looked down");
            deductFocus();
          }

          if (lookLeft && lookRight) {
            console.log("looked both ways");
            lookLeft = false;
            lookRight = false;
            setLookedLR(true);
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
    <div style={{ textAlign: "center", padding: "10px" }}>
      <div >
        {captureVideo && modelsLoaded ? (
          <button
            onClick={closeWebcam}
            style={{
              width: "70%",
              cursor: "pointer",
              backgroundColor: "#6b1919",
              color: "white",
              padding: "15px",
              fontSize: "25px",
              border: "none",
              fontWeight: 100,
            }}
          >
            END
          </button>
        ) : (
          <button
            onClick={startVideo}
            style={{
              width: "70%",
              cursor: "pointer",
              backgroundColor: "#48754a",
              color: "white",
              padding: "15px",
              fontSize: "25px",
              border: "none",
            }}
          >
            START
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
                playsInline
                ref={videoRef}
                height={videoHeight}
                width={videoWidth}
                onPlay={handleVideoOnPlay}
                style={{ margin: "auto", borderRadius: "10px" }}
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
        style={{
          marginTop: '10px',
          width: "70%",
          cursor: "pointer",
          backgroundColor: "#48754a",
          color: "white",
          padding: "15px",
          fontSize: "25px",
          border: "none",
        }}
      >
        CALIBRATE
      </button>
    </div>
  );
}

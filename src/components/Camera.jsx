import React, { useEffect, useRef, useState, memo } from "react";
import Webcam from "react-webcam";
import { load as COCOSSDLOAD } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";

const Camera = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("");
  const [informOwner, setInformOwner] = useState(false);
  const webcamRef = useRef(null);
  const audioRef = useRef(null);
  let intervaldetetct;

  const loadModel = async () => {
    setLoading(true);
    const model = await COCOSSDLOAD();
    setLoading(false);

    intervaldetetct = setInterval(() => {
      detectobject(model);
    }, 10);
  };

  const sendSms = async () => {
    const accountSid = ""; // Your Twilio Account SID
    const authToken = ""; // Your Twilio Auth Token
    const toNumber = ""; // Replace with the recipient's phone number
    const fromNumber = ""; // Your Twilio phone number
    const now = new Date();
    const currentTime = now.toLocaleTimeString();
    const messageBody = `Some intruder at home ${currentTime}`; // Body of the SMS message

    try {
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        new URLSearchParams({
          Body: messageBody,
          From: fromNumber,
          To: toNumber,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`, // Use btoa() for Base64 encoding
          },
        }
      );

      console.log("SMS sent successfully:", response.data);
      // Handle success, show feedback to the user, etc.
    } catch (error) {
      console.error("Error sending SMS:", error);
      // Handle error, show error message to the user, etc.
    }
  };

  const detectobject = async (model) => {
    if (webcamRef.current.video && webcamRef.current.video.readyState === 4) {
      const predictions = await model.detect(
        webcamRef.current.video,
        undefined,
        0.7
      );
      console.log("Predictions: ");
      console.log(predictions);
      const detectedClasses = predictions.map((elem) => elem.class);
      setResult(detectedClasses);

      if (detectedClasses.includes("person")) {
        setInformOwner(true);
         audioRef.current.play(); // Play the sound
        sendSms(); //send the detetcion warning message to client
        webcamRef.current.video.style.border = "5px solid #facc15";
        webcamRef.current.video.style.objectFit = "cover";
        webcamRef.current.video.style.borderRadius = "8px";
      } else {
        setInformOwner(false);
      }
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  return (
    <div className=" h-3/4 mt-7 relative">
      {loading ? (
        <div className="text-yellow-400 text-center text-5xl font-['Open_Sans'] font-black py-6 h-full  flex justify-center items-center">
          Loading...
        </div>
      ) : (
        <>
          <Webcam
            muted
            ref={webcamRef}
            className="absolute w-full bottom-0 h-full lg:w-[50vw] lg:top-0 lg:translate-x-[50%] px-0 py-0 rounded-lg"
          />
          <div className="absolute h-full lg:w-[50vw] top-0 translate-x-[50%]">
            {result == "person" ? (
              <div className="absolute top-[5vh] left-0 lg:top-[-1vh] text-red-700  text-2xl lg:text-3xl font-['Open_Sans'] bg-yellow-500 font-black py-3 lg:py-4 px-3 rounded-lg">
                <h1 className="text-center">Person Detected</h1>
              </div>
            ) : (
              <div className="absolute  left-0 top-[5vh] lg:top-[-1vh] text-blue-700 text-2xl lg:text-3xl font-['Open_Sans'] bg-yellow-500 font-black py-3 lg:py-4 px-3 rounded-lg capitalize">
                <h1>{result} </h1>
              </div>
            )}
          </div>
          <audio ref={audioRef} src="src/audio/alarm.mp3" />
        </>
      )}
    </div>
  );
};

export default memo(Camera);

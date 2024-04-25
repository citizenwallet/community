"use client";

import React, { useCallback, useEffect, useState } from "react";

const NFCReader = ({
  onChange,
}: {
  onChange: (event: NDEFReadingEvent) => any;
}) => {
  const [nfcAvailable, setNfcAvailable] = useState(false);
  const [scanning, setScanning] = useState(false);

  const startScanner = async () => {
    try {
      const ndef = new NDEFReader();
      console.log("Starting scanner...", ndef.scan);
      await ndef.scan();

      console.log("Scan started successfully.");
      ndef.onreadingerror = () => {
        console.log("Cannot read data from the NFC tag. Try another one?");
      };

      ndef.onreading = (event) => {
        console.log("NDEF message read.");
        onChange(event);
      };

      setScanning(true);
    } catch (error) {
      console.log(`Error! Scan failed to start: ${error}.`);
    }
  };

  const scan = useCallback(async () => {
    if ("NDEFReader" in window) {
      try {
        new NDEFReader();
        setNfcAvailable(true);
      } catch (error) {
        console.log(`Error! Scan failed to start: ${error}.`);
      }
    }
  }, []);

  useEffect(() => {
    scan();
  }, [scan]);

  return (
    <center>
      {nfcAvailable && (
        <button
          className={`btn w-64 h-60 flex flex-row align-middle mt-24 text-xl rounded-2xl ${
            scanning ? "disabled btn-secondary" : "btn-primary"
          }`}
          onClick={startScanner}
        >
          <div>
            <svg
              fill="#fff"
              width="200px"
              height="150px"
              viewBox="0 -24.98 122.88 122.88"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path d="M45.45,72.81C30.81,71.53,17.88,66.1,9.47,57.69c-4.8-4.79-7.71-9.99-9.02-16.12c-0.6-2.79-0.6-7.41,0.01-10.23 c1.83-8.52,7.33-15.97,16-21.66C36.23-3.28,66.52-3.22,86.11,9.83c2.6,1.73,4.28,3.11,6.64,5.43c2.97,2.93,5.06,5.85,7.26,10.13 c0.08,0.16,0.49,0.36,0.9,0.44c1.39,0.29,3.24,1.37,4.73,2.76c1.16,1.08,2.05,2.26,4.26,5.6c2.23,3.37,12.31,18.93,12.92,19.95 c0.24,0.4-0.23,1.03-0.76,1.03c-0.38,0-0.64-0.25-1.2-1.13c-0.39-0.62-2.96-4.61-5.71-8.87c-9.73-15.06-10.25-15.76-12.96-17.12 l-1.42-0.71l-4.18,0c-4.18,0-4.18,0-4.28,0.44c-0.55,2.41-0.66,3-0.54,3.11c0.08,0.07,2.45,1.42,5.27,3l5.13,2.87l-0.32,0.67 c-0.18,0.37-0.38,0.67-0.45,0.67s-4.39-2.39-9.6-5.32c-5.21-2.92-9.78-5.4-10.15-5.5c-1.48-0.41-3.76,1.23-3.76,2.71 c0,1.5,0.44,1.93,9.6,9.43c5.71,4.68,8.98,7.49,9.48,8.15c0.91,1.21,1.83,2.99,2.67,5.18c1.49,3.86,3.91,6.01,7.88,7.01l1.31,0.33 l-0.11,0.71c-0.06,0.39-0.14,0.75-0.19,0.8c-0.17,0.19-2.8-0.65-4.32-1.38c-2.38-1.14-4.02-2.77-5.63-5.61 c-0.01-0.02-0.95,0.3-2.07,0.71c-2,0.73-2.1,0.79-3.99,2.64c-8.07,7.88-19.65,12.91-33.62,14.62 C56.61,72.9,47.87,73.03,45.45,72.81L45.45,72.81L45.45,72.81z M59.36,70.39c6.41-0.85,11.39-2.12,16.59-4.25 c5.46-2.24,10.62-5.45,14.22-8.87l1.42-1.35l-3.58-1.71c-3.82-1.83-4.2-2.13-4.69-3.76c-0.31-1.03,0.04-2.13,1.02-3.18l0.76-0.83 l-1.66-1.26c-1.31-1-1.72-1.43-1.98-2.09c-0.41-1.07-0.26-2.23,0.4-3.16l0.5-0.71l-5.24-0.92c-2.88-0.51-5.57-1.02-5.97-1.14 c-0.79-0.23-1.58-1.13-1.79-2c-0.11-0.47,2.46-13.01,3.03-14.8c0.26-0.8,1.35-1.77,2.18-1.92c0.87-0.16,16.31,2.55,17.08,3 c1.22,0.71,1.6,1.85,1.22,3.61l-0.16,0.73l0.85,0c0.47,0,1.58-0.06,2.47-0.13l1.62-0.13l-0.8-1.49C94.44,19.54,90.05,15,84.64,11.4 c-2.53-1.68-7.92-4.34-11.17-5.5c-4.62-1.65-10.21-2.89-15.58-3.45c-2.95-0.31-10.66-0.3-13.52,0.01 C37.52,3.2,31.3,4.75,25.86,7.07C13.26,12.44,4.79,21.34,2.62,31.48c-0.57,2.65-0.61,7.29-0.09,9.7c1.15,5.33,3.65,9.94,7.72,14.23 c8.3,8.74,20.98,14.12,36.18,15.33C48.47,70.9,57.29,70.66,59.36,70.39L59.36,70.39z M56.59,60.85c-0.78-0.23-1.58-1.16-1.75-2.05 c-0.11-0.58,0.02-0.98,0.85-2.59c3.36-6.5,4.82-12.48,4.82-19.73c0-7.01-1.29-12.47-4.5-19.01c-0.69-1.4-1.25-2.71-1.25-2.9 c0-0.7,0.58-1.71,1.21-2.1c0.86-0.54,2.31-0.44,3.01,0.21c0.27,0.25,0.96,1.39,1.54,2.53c2.3,4.51,3.87,9.46,4.65,14.61 c0.48,3.19,0.58,9.23,0.19,12.15c-0.71,5.38-2.13,10.19-4.41,14.89c-1.38,2.84-2.24,4.01-2.96,4.01c-0.14,0-0.38,0.04-0.52,0.08 C57.33,60.99,56.93,60.95,56.59,60.85L56.59,60.85L56.59,60.85z M47.24,55.96c-1.2-0.35-2.07-1.83-1.72-2.93 c0.08-0.27,0.65-1.5,1.26-2.74c2.57-5.25,3.64-10.87,3.12-16.39c-0.43-4.54-1.24-7.4-3.29-11.58c-1.37-2.81-1.44-3.24-0.64-4.38 c0.76-1.08,2.66-1.25,3.65-0.34c0.69,0.63,2.84,5.12,3.67,7.66c2.74,8.4,2.32,17.43-1.19,25.68 C50.29,55.17,49.02,56.48,47.24,55.96L47.24,55.96z M37.6,51c-0.74-0.33-1.38-1.12-1.56-1.91c-0.11-0.48,0.08-1.02,0.96-2.8 c3.24-6.56,3.27-12.87,0.11-19.28c-1.39-2.81-1.42-3.37-0.25-4.48c0.58-0.55,0.83-0.64,1.64-0.64c1.37,0,2.08,0.69,3.3,3.2 c1.88,3.86,2.65,7.21,2.64,11.5c-0.01,4.41-0.73,7.44-2.73,11.51c-1.15,2.33-1.72,2.95-2.87,3.1C38.49,51.23,37.93,51.15,37.6,51 L37.6,51L37.6,51z M28.6,46.38c-0.59-0.24-1.26-1.04-1.46-1.74c-0.22-0.78-0.04-1.4,0.84-2.85c1.14-1.87,1.4-2.87,1.4-5.31 c0-2.44-0.26-3.45-1.4-5.31c-0.39-0.63-0.77-1.39-0.86-1.69c-0.37-1.23,0.66-2.74,2.04-3c1.17-0.22,1.97,0.3,3.05,1.98 c3.11,4.86,3.11,11.34,0,16.16C31.11,46.31,29.89,46.91,28.6,46.38L28.6,46.38L28.6,46.38z M95.63,53.92 c1.04-0.37,1.94-0.72,2-0.78c0.06-0.06-0.14-0.72-0.45-1.48c-0.62-1.55-0.52-1.51-2.74-1.09c-2.39,0.46-3.78,0.05-6.4-1.88 c-0.71-0.53-1.45-0.96-1.63-0.96c-0.19,0-0.59,0.27-0.91,0.61c-0.67,0.72-0.77,1.84-0.23,2.51c0.48,0.58,7.05,3.71,7.83,3.73 C93.45,54.59,94.58,54.29,95.63,53.92L95.63,53.92L95.63,53.92z M94.59,48.89c0.97-0.2,1.08-0.26,0.91-0.58 c-0.19-0.35-9.28-7.89-10.07-8.36c-0.65-0.38-1.18-0.29-1.72,0.29c-1.58,1.69-1.39,2.05,2.7,5.18 C91.35,49.21,91.88,49.43,94.59,48.89L94.59,48.89z M82.39,37.46c0-0.05-1.03-0.94-2.29-1.97c-3.11-2.56-3.78-3.52-3.78-5.42 c0-1.58,1.06-3.11,2.76-3.99c0.84-0.44,2.35-0.57,3.2-0.29c0.6,0.2,3.32,1.67,7.08,3.83l0.79,0.46l0.65-3.1 c0.67-3.17,0.68-4.01,0.06-4.2c-0.19-0.06-3.82-0.72-8.06-1.47c-7.54-1.33-8.37-1.41-8.72-0.84c-0.19,0.3-3.06,13.6-3.06,14.16 c0,0.28,0.14,0.63,0.32,0.78c0.17,0.15,2.62,0.68,5.44,1.18C82.22,37.57,82.39,37.6,82.39,37.46L82.39,37.46z" />
              </g>
            </svg>
          </div>
          <div className="pb-4">
            {scanning ? "Scanning..." : "Start scanning"}
          </div>
        </button>
      )}
      {!nfcAvailable && (
        <center>
          <button className="btn disabled btn-primary w-64 rounded-md">
            NFC not available on this device
          </button>
          <div className="text-sm my-2">
            Requires Chrome on Android (
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_NFC_API#browser_compatibility">
              more info
            </a>
            )
          </div>
        </center>
      )}
    </center>
  );
};

export default NFCReader;

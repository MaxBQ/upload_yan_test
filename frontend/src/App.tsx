import "./App.css";
import { ChangeEvent, useRef } from "react";
import * as tus from "tus-js-client";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  const clickInput = () => {
    inputRef.current && inputRef.current.click();
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files![0];
    let upload = new tus.Upload(file, {
      // Endpoint is the upload creation URL from your tus server
      endpoint: "http://localhost:5000/uploads",
      // Retry delays will enable tus-js-client to automatically retry on errors
      retryDelays: [0, 3000, 5000, 10000, 20000],
      // Attach additional meta data about the file for the server
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      // Callback for errors which cannot be fixed using retries
      onError: function (error) {
        console.log("Failed because: " + error);
      },
      // Callback for reporting upload progress
      onProgress: function (bytesUploaded, bytesTotal) {
        let percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(bytesUploaded, bytesTotal, percentage + "%");
      },
      // Callback f`or once the upload is completed
      onSuccess: function () {
        console.log("Download %s from %s", upload.file, upload.url);
      },
    });
    upload.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      // Start the upload
      upload.start();
    });
  };
  return (
    <>
      <div className="drop-zone" onClick={clickInput}>
        <span className="drop-zone__prompt">
          Drop file here or click to upload
        </span>
        <input
          ref={inputRef}
          type="file"
          name="file"
          className="drop-zone__input"
          onChange={onFileChange}
        />
      </div>
    </>
  );
}

export default App;

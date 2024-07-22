import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    } else {
      alert("Please select an image file.");
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }
    setLoading(true);
    const userMessage = { sender: "user", content: "Uploaded an image" };
    setMessages([...messages, userMessage]);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const botMessage = {
        sender: "bot",
        content: `Upload successful. Processing the image...`,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const results = response.data;

      const resultMessage = {
        sender: "bot",
        content: (
          <div>
            <strong>Results:</strong>
            {results.areas.length > 0 ? (
              results.areas.map((area, index) => (
                <div key={index}>
                  <p>
                    Object {index + 1} Area: {area.toFixed(2)} cm²
                  </p>
                  <p>Class ID: {results.class_ids[index]}</p>
                  <p>Score: {results.scores[index].toFixed(2)}</p>
                  <hr />
                </div>
              ))
            ) : (
              <p>No objects detected or ruler not found in the image.</p>
            )}
          </div>
        ),
      };
      setMessages((prevMessages) => [...prevMessages, resultMessage]);
    } catch (error) {
      console.error("Error processing the image:", error);
      const errorMessage = {
        sender: "bot",
        content: "Error processing the image. Please try again.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Wound Area Estimator</h2>
        <div className="chat-container">
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender}`}>
              {typeof message.content === "string" ? (
                <p>{message.content}</p>
              ) : (
                message.content
              )}
            </div>
          ))}
          {loading && <div className="chat-message bot">Loading...</div>}
        </div>
        <form
          id="upload-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleUpload();
          }}
        >
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
      </header>
    </div>
  );
}

export default App;

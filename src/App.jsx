import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    const userMessage = { sender: "user", content: "Uploaded an image" };
    setMessages([...messages, userMessage]);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const botMessage = {
        sender: "bot",
        content: `Estimated Wound Area: ${res.data.area}`,
      };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error uploading the image:", error);
      const errorMessage = {
        sender: "bot",
        content: "Error uploading the image",
      };
      setMessages([...messages, userMessage, errorMessage]);
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
              {message.content}
            </div>
          ))}
          {loading && <div className="chat-message bot">Loading...</div>}
        </div>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button onClick={handleUpload}>Upload</button>
      </header>
    </div>
  );
}

export default App;

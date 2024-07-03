import React, { useState } from "react";

import "./App.css";
import { storage } from "./config/firebase";
import { ref, uploadBytes } from "firebase/storage";

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
    const filesFolderRef = ref(storage, `projectFiles/${selectedFile.name}`);
    const userMessage = { sender: "user", content: "Uploaded an image" };
    setMessages([...messages, userMessage]);

    try {
      await uploadBytes(filesFolderRef, selectedFile);
      const botMessage = {
        sender: "bot",
        content: `Upload successful`,
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
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </header>
    </div>
  );
}

export default App;

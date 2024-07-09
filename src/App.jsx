import React, { useState } from "react";
import "./App.css";
import { storage } from "./config/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import axios from "axios";

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
    const filesFolderRef = ref(storage, `projectFiles/${selectedFile.name}`);
    const userMessage = { sender: "user", content: "Uploaded an image" };
    setMessages([...messages, userMessage]);

    try {
      await uploadBytes(filesFolderRef, selectedFile);
      const downloadURL = await getDownloadURL(filesFolderRef);

      const botMessage = {
        sender: "bot",
        content: `Upload successful. Processing the image...`,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Send the image URL to the Flask backend
      const response = await axios.post("http://127.0.0.1:5000/", {
        imageUrl: downloadURL,
      });

      const results = response.data;
      const resultMessage = {
        sender: "bot",
        content: `Wound Area: ${results.areas.join(
          ", "
        )} cm²\nScores: ${results.scores.join(", ")}`,
      };
      setMessages((prevMessages) => [...prevMessages, resultMessage]);
    } catch (error) {
      console.error("Error processing the image:", error);
      const errorMessage = {
        sender: "bot",
        content: "Error processing the image",
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
              {message.content}
            </div>
          ))}
          {loading && <div className="chat-message bot">Loading...</div>}
        </div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </header>
    </div>
  );
}

export default App;

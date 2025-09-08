import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import './App.css'

const App = () => {
  const [sentMessage, setSentMessage] = useState(""); // why not null
  const [socket, setSocket] = useState(null);
  const [rMessages, setRMessages] = useState([]);

  const renderMessages = () => {
    return rMessages.map((msg, index) => <div key={index}>
      <p className={msg.type === 'sent' ? 'bg-red-100' : 'bg-blue-100'}>{msg.text}</p>
    </div>);
  };

  useEffect(() => {
    const newSocket = io("http://localhost:8000"); // why no ws: ?

    newSocket.on("connect", () => {
      console.log(`Client with ${newSocket.id} connected our server`);
    });

    newSocket.on("message", (msg) => {
      const receivedMsg = {
        ...msg,
        type : 'received'
      }
      console.log('Received msg',receivedMsg);
      setRMessages((prev) => [...prev, receivedMsg]);
    });

    setSocket(newSocket);

    return () => {
      // why write cleanup ?
      newSocket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  const sendinMsg = () => {
    const messageObject = {
      text : sentMessage,
      type : 'sent',
      timestamp : new Date()
    }
    if (socket && sentMessage) {
      console.log(messageObject);
      setRMessages((prev) => [...prev,messageObject]);
      socket.emit("message", sentMessage);
      setSentMessage("");
    }
  };

  return (
    <div>
      <h1>Chatting App</h1>
      <div>
        <input
          type="text"
          placeholder="Send Message"
          value={sentMessage}
          onChange={(e) => setSentMessage(e.target.value)}
        />
        <button onClick={sendinMsg}>Send</button>
      </div>
      <div>
        {renderMessages()}
      </div>
    </div>
  );
};

export default App;
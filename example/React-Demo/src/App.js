import React, { useState } from "react";
import KommunicateChat from "./chat";

function App() {
  const [mail, setMail] = useState("");
  const [callAgain, setCallAgain] = useState(true);

  const handleClick = () => {
    delete window.kommunicate &&
      typeof window.Kommunicate?.logout == "function" &&
      window.Kommunicate.logout();
    setCallAgain(true);
  };

  const handleEmailChange = (event) => {
    setCallAgain(false);
    setMail(event.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "20px",
      }}
    >
      <label>Email</label>
      <input
        style={{ padding: "4px" }}
        type="email"
        onBlur={handleEmailChange}
        placeholder="Enter your email"
      />
      {callAgain && <KommunicateChat mail={mail} />}
      <button style={{ padding: "4px" }} onClick={handleClick}>
        Log in
      </button>
    </div>
  );
}

export default App;

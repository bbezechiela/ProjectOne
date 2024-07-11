// import Nav from "./components/Nav";
import Login from "./components/Login";
import NavOne from "./components/NavOne";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [getStatus, setStatus] = useState(false);

  return (
    <>
      <NavOne isLoggedIn={getStatus} setUserLogIn={setStatus} />
    </>
  )
}

export default App; 
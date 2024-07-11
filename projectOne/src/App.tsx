// import Nav from "./components/Nav";
import NavOne from "./components/NavOne";
import { useState } from "react";

const App = () => {
  const [getStatus, setStatus] = useState(false);

  return (
    <>
      <NavOne isLoggedIn={getStatus} setUserLogIn={setStatus} />
    </>
  )
}

export default App; 
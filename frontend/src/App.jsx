import { useState } from "react";
import AuthForm from "./components/AuthForm";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

const handleLogin =(userData, token)=>{
  localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);
  }

  //logout handle
  // const handleLogout = () => {
  //   localStorage.removeItem("user");
  //   localStorage.removeItem("token");
  //   setUser(null); // This will redirect back to AuthForm
  // };

  if (!user) return <AuthForm setUser={setUser} />;
  // return <Dashboard user={user} onLogout={handleLogout} />;

  return <Dashboard user={user} />;
}

export default App;
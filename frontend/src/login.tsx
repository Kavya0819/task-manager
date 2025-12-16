
import { useState } from "react";
import { api } from "./api";

function Login({ onLogin }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    onLogin();
  };
api.post("/auth/login", { email, password })
  .then(res => {
    localStorage.setItem("token", res.data.token);
  });
  return (
    <>
      <input onChange={e => setEmail(e.target.value)} />
      <input type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </>
  );
}


export default Login;

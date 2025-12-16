import { useEffect, useState } from "react";
import { api } from "./api";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("https://task-manager-backend-nrif.onrender.com");

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const login = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setLoggedIn(true);
    } catch {
      alert("Wrong email or password");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setTasks([]);
  };

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  const createTask = async () => {
    if (!title) return;
    await api.post("/tasks", { title });
    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  useEffect(() => {
    if (loggedIn) fetchTasks();
  }, [loggedIn]);

 
  useEffect(() => {
  const handleUpdate = () => {
    fetchTasks();
  };

  socket.on("task:update", handleUpdate);

  return () => {
    socket.off("task:update", handleUpdate);
  };
}, []);


  // LOGIN UI
  if (!loggedIn) {
    return (
      <div className="page">
        <div className="login-card">
          <h2>Task Manager</h2>
          <p className="subtitle">Login to continue</p>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login}>Login</button>
        </div>
      </div>
    );
  }

  // TASK UI
  return (
    <div className="page">
      <div className="container">
       

       <div className="add-task">
  <input
    placeholder="New task"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />
  <button onClick={createTask}>Add</button>
</div>

   {tasks.length === 0 && (
  <p className="empty">No tasks yet</p>
)}


        {tasks.map((task) => (
          <div className="task" key={task.id}>
            <span>{task.title}</span>
            <button
  className="delete-btn"
  onClick={() => deleteTask(task.id)}
>
  Delete
</button>

          </div>
        ))}
         <button className="logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

// CSS styles
const styles = {
  appContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff7ed",
    fontFamily: "Arial, sans-serif",
  },
  navbar: {
    backgroundColor: "#f97316",
    color: "white",
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  navButton: {
    padding: "8px 16px",
    backgroundColor: "#fff7ed",
    color: "#c2410c",
    fontWeight: "bold",
    borderRadius: "9999px",
    textDecoration: "none",
    boxShadow: "1px 1px 3px rgba(0,0,0,0.1)",
  },
  logoutButton: {
    padding: "8px 16px",
    backgroundColor: "#ef4444",
    color: "white",
    fontWeight: "bold",
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
  },
  mainContent: {
    flex: 1,
    padding: "32px",
  },
  title: {
    textAlign: "center",
    color: "#ea580c",
    fontSize: "2.5rem",
    marginBottom: "32px",
    fontWeight: "800",
  },
  addTaskForm: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "24px",
  },
  taskInput: {
    padding: "12px",
    width: "66%",
    border: "2px solid #fdba74",
    borderRadius: "8px",
  },
  addButton: {
    padding: "12px 24px",
    backgroundColor: "#f97316",
    color: "white",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
  },
  filters: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  filterSelect: {
    padding: "8px",
    border: "2px solid #fdba74",
    borderRadius: "8px",
  },
  taskList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  taskItem: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "12px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  taskText: {
    fontSize: "1rem",
    color: "#7c2d12",
  },
  taskMeta: {
    fontSize: "0.875rem",
    color: "gray",
    marginLeft: "8px",
  },
  taskActions: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  statusButton: {
    padding: "6px 12px",
    fontWeight: "bold",
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
  },
  prioritySelect: {
    padding: "6px",
    border: "2px solid #fdba74",
    borderRadius: "8px",
  },
  deleteButton: {
    padding: "6px 12px",
    backgroundColor: "#dc2626",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "9999px",
    cursor: "pointer",
  },
  footer: {
    backgroundColor: "#f97316",
    color: "white",
    padding: "16px",
    textAlign: "center",
    marginTop: "auto",
  },
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const fetchTasks = async (token) => {
    const response = await fetch("https://to-do-backend-s0dj.onrender.com/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setTasks(Array.isArray(data) ? data : data.tasks || []);
  };

  useEffect(() => {
    if (token) fetchTasks(token);
  }, [token]);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

  const addTask = async (text) => {
    const response = await fetch("https://to-do-backend-s0dj.onrender.com/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text, status: "pending", priority: "medium" }),
    });
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
  };

  const deleteTask = async (id) => {
    await fetch(`https://to-do-backend-s0dj.onrender.com/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const updateTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    const response = await fetch(
      `https://to-do-backend-s0dj.onrender.com/tasks/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const updateTaskPriority = async (id, newPriority) => {
    const response = await fetch(
      `https://to-do-backend-s0dj.onrender.com/tasks/${id}/priority`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority: newPriority }),
      }
    );
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (filterStatus === "all" || task.status === filterStatus) &&
      (filterPriority === "all" || task.priority === filterPriority)
  );

  const MainApp = () => (
    <div style={styles.appContainer}>
      <nav style={styles.navbar}>
        <a href="#" style={styles.navButton}>Home</a>
        <button onClick={logout} style={styles.logoutButton}>Logout</button>
      </nav>
      <main style={styles.mainContent}>
        <h1 style={styles.title}>MERN To-Do App</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTask(e.target[0].value);
            e.target[0].value = "";
          }}
          style={styles.addTaskForm}
        >
          <input
            type="text"
            style={styles.taskInput}
            placeholder="Add a task"
          />
          <button type="submit" style={styles.addButton}>Add</button>
        </form>
        <div style={styles.filters}>
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.filterSelect}
            value={filterStatus}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            onChange={(e) => setFilterPriority(e.target.value)}
            style={styles.filterSelect}
            value={filterPriority}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <ul style={styles.taskList}>
          {filteredTasks.map((task) => (
            <li key={task._id} style={styles.taskItem}>
              <div style={styles.taskText}>
                <span>{task.text}</span>
                <span style={styles.taskMeta}>({task.status}, {task.priority})</span>
              </div>
              <div style={styles.taskActions}>
                <button
                  onClick={() => updateTaskStatus(task._id, task.status)}
                  style={{
                    ...styles.statusButton,
                    backgroundColor:
                      task.status === "pending" ? "#facc15" : "#4ade80",
                    color: task.status === "pending" ? "#78350f" : "#064e3b",
                  }}
                >
                  {task.status === "pending" ? "Mark Complete" : "Mark Pending"}
                </button>
                <select
                  value={task.priority}
                  onChange={(e) =>
                    updateTaskPriority(task._id, e.target.value)
                  }
                  style={styles.prioritySelect}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={() => deleteTask(task._id)}
                  style={styles.deleteButton}
                  title="Delete Task"
                >
                  🗑 Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <footer style={styles.footer}>© 2025 Your To-Do App</footer>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={token ? <MainApp /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;

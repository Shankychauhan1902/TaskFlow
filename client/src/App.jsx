import { useEffect, useState } from "react";
import "./App.css";
function App() {
  const API_URL = "http://localhost:5000/api/tasks";
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data.tasks);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks((prevTasks) => [...prevTasks, data]);
        setTitle("");
        setDescription("");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };
  const handleUpdate = () => {
    if (!editTitle.trim()) {
      alert("Title is required");
      return;
    }
    fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
      }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks((prev) =>
          prev.map((task) => (task._id === editingId ? updatedTask : task)),
        );
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
      })
      .catch(console.error);
  };
  const handleCancel = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };
  return (
    <div className="App">
      <h1>TaskFlow</h1>
      <p className="subtitle">
        Organise your tasks efficiently
      </p>
      <form className="task-form" onSubmit={handleSubmit}>
        <input className="input"
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input className="input"
          type="text"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={!title.trim()}>
          Add Task
        </button>
      </form>

      {tasks.length ===0 && (
        <p className="empty">
          No tasks yet. Add your first task.
        </p>
      )}
      <div className="task-list">
      {tasks.map((task) => (
        <div key={task._id} className="task-card">
          {editingId === task._id ? (
            <>
              <input
                className="input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <input
                className="input"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />

              <div className="button-group">
              <button className="btn btn-save" onClick={handleUpdate} type="button">Save</button>
              <button className="btn btn-cancel" onClick={handleCancel} type="button">Cancel</button>
              </div>
            </>
          ) : (
            <>
             <h2 className="task-title">{task.title}</h2>
             <p className="task-description">{task.description || "No description"}
             </p>
             <div className="task-meta">
              <span className={`status${task.status?.toLowerCase()}`}>
                Status: {task.status || "Pending"}
              </span>

              <span className={`priority ${task.priority?.toLowerCase()}`}>
                Priority: {task.priority || "Medium"}
              </span>

              <span className="due-date">
                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not Set"}
              </span>
              </div>

              <div className="button-group">
              <button className="btn btn-edit" onClick={() => handleEdit(task)} type="button">Edit</button>

              <button className="btn btn-delete" onClick={() => {
                if(window.confirm("Delete this task?")){
                  handleDelete(task._id);
                }
              }} type="button"
              >Delete</button>
              </div>
              </>
          )}
        </div>
      ))}
      </div>
    </div>
  );
}

export default App;

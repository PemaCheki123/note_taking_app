import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const axiosAuth = axios.create();
  axiosAuth.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && refreshToken) {
        try {
          const res = await axios.post("http://localhost:5000/api/auth/refresh", { refreshToken });
          localStorage.setItem("accessToken", res.data.accessToken);
          error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return axios(error.config);
        } catch (err) {
          handleLogout();
        }
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const res = await axiosAuth.get("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setNotes(res.data);
    } catch {}
  };

  const addNote = async () => {
    try {
      await axiosAuth.post(
        "http://localhost:5000/api/notes",
        { title, content },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setTitle("");
      setContent("");
      fetchNotes();
    } catch {}
  };

  const deleteNote = async (id) => {
    try {
      await axiosAuth.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      fetchNotes();
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>

        <h2 style={styles.title}>Your Notes ✨</h2>

        <div style={styles.form}>
          <input
            placeholder="Cute title... ✏️"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder="Pour your heart here 💖"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
          />
          <button onClick={addNote} style={styles.button}>Add ✨</button>
        </div>

        <div style={styles.noteList}>
          {notes.length === 0 ? (
            <p style={{ color: "#777" }}>No notes yet. Write your first cute thought! 💕</p>
          ) : (
            notes.map((n) => (
              <div key={n.id} style={styles.noteCard}>
                <h4 style={styles.noteTitle}>{n.title} ✨</h4>
                <p style={styles.noteContent}>{n.content}</p>
                <button onClick={() => deleteNote(n.id)} style={styles.deleteButton}>❌</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8e8f8, #eaf5ff)",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "'Poppins', sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "850px",
    background: "rgba(255,255,255,0.45)",
    backdropFilter: "blur(18px)",
    borderRadius: "25px",
    padding: "30px",
    border: "2px solid rgba(255,255,255,0.4)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    position: "relative",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    transition: "0.3s",
    animation: "fadeIn 0.9s ease forwards",
  },

  logoutButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "#FF9AA2",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.3s",
  },

  title: {
    textAlign: "center",
    color: "#444",
    marginBottom: "25px",
    fontSize: "30px",
    fontWeight: 700,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "40px",
  },

  input: {
    padding: "14px",
    borderRadius: "14px",
    border: "2px solid #ffdce5",
    outline: "none",
    background: "#fff0f6",
  },

  textarea: {
    padding: "14px",
    borderRadius: "14px",
    border: "2px solid #ffdce5",
    background: "#fff0f6",
    resize: "vertical",
    minHeight: "90px",
  },

  button: {
    padding: "14px",
    background: "#B5EAD7",
    color: "#555",
    fontWeight: 700,
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    width: "160px",
    alignSelf: "flex-end",
    transition: "0.3s",
  },

  noteList: {
    display: "grid",
    gap: "18px",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
  },

  noteCard: {
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "20px",
    position: "relative",
    transition: "0.3s",
    border: "1px solid rgba(255,255,255,0.5)",
    animation: "fadeUp 0.6s ease",
  },

  noteTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#555",
  },

  noteContent: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#777",
  },

  deleteButton: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#FFB3BA",
    border: "none",
    borderRadius: "10px",
    padding: "6px 10px",
    cursor: "pointer",
  },
};

export default Notes;

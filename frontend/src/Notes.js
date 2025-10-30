import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const fetchNotes = async () => {
    try {
      const res = await axiosAuth.get("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async () => {
    if (!title.trim()) return alert("Title cannot be empty.");
    setLoading(true);
    try {
      await axiosAuth.post(
        "http://localhost:5000/api/notes",
        { title, content },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const editNote = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    if (!title.trim()) return alert("Title cannot be empty.");
    setLoading(true);
    try {
      await axiosAuth.put(
        `http://localhost:5000/api/notes/${editingNote.id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setEditingNote(null);
      setShowModal(false);
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axiosAuth.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setShowModal(false);
    setTitle("");
    setContent("");
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

        {/* ✅ Form with embedded image */}
        <div style={styles.form}>
          <div style={styles.topImage}>
      
          </div>
          <h2 style={styles.title}>Your Notes ✨</h2>
          <input
            placeholder="Write your Notes... ✏️"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder="Describe it more"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
          />
          <button onClick={addNote} style={styles.button} disabled={loading}>
            {loading ? "Saving..." : "Add"}
          </button>
        </div>

        {/* Notes Grid */}
        <div style={styles.noteList}>
          {notes.length === 0 ? (
            <p style={{ color: "#777" }}>No notes yet. Write your first thought! </p>
          ) : (
            notes.map((n) => (
              <div key={n.id} style={styles.noteCard}>
                <div style={styles.cardButtonsTop}>
                  <button onClick={() => editNote(n)} style={styles.editButton}>Edit</button>
                  <button onClick={() => deleteNote(n.id)} style={styles.deleteButton}>Delete</button>
                </div>
                <h4 style={styles.noteTitle}>{n.title}</h4>
                <p style={styles.noteContent}>{n.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for Editing */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Edit Note ✏️</h2>
            <input
              placeholder="Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
            <textarea
              placeholder="Write your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={styles.textarea}
            />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={cancelEdit} style={styles.cancelButton}>Cancel</button>
              <button onClick={handleEditSubmit} style={styles.button}>
                {loading ? "Saving..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f5f5f7 0%, #ffffff 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'SF Pro Display', 'Inter', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "850px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "30px 40px",
    border: "1px solid #e0e0e0",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    position: "relative",
  },
  logoutButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "#efefef",
    color: "#333",
    border: "1px solid #ccc",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 500,
  },
  title: {
    textAlign: "center",
    color: "#111",
    marginBottom: "5px",
    fontSize: "28px",
    fontWeight: 700,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "40px",
  },
  topImage: {
    width: "100%",
    height: "200px",
    backgroundImage: "url('https://i.pinimg.com/1200x/9d/35/e1/9d35e119bbeb1539749902da35193f4d.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "12px",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  topImageText: {
    color: "white",
    fontSize: "24px",
    fontWeight: "700",
    textShadow: "0 2px 6px rgba(0,0,0,0.4)",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #dcdcdc",
    outline: "none",
    background: "#fafafa",
    fontSize: "15px",
  },
  textarea: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #dcdcdc",
    background: "#fafafa",
    resize: "vertical",
    minHeight: "100px",
    fontSize: "15px",
  },
  button: {
    padding: "12px 20px",
    background: "#007AFF",
    color: "white",
    fontWeight: 600,
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    width: "120px",
    alignSelf: "flex-end",
  },
  noteList: {
    display: "grid",
    gap: "18px",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  },
  noteCard: {
    background: "#fdfdfd",
    border: "1px solid #eaeaea",
    borderRadius: "12px",
    padding: "16px",
    position: "relative",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
  },
  noteTitle: {
    fontSize: "17px",
    fontWeight: 600,
    color: "#111",
    marginTop: "30px", // so title sits below top-right buttons
  },
  noteContent: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#555",
    lineHeight: 1.5,
  },
  cardButtonsTop: {
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "flex",
    gap: "8px",
  },
  editButton: {
    background: "#e8f0fe",
    border: "1px solid #bcd0ff",
    borderRadius: "8px",
    padding: "6px 10px",
    cursor: "pointer",
  },
  deleteButton: {
    background: "#fdecea",
    border: "1px solid #f5b3ae",
    borderRadius: "8px",
    padding: "6px 10px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    width: "90%",
    maxWidth: "500px",
    background: "#fff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  cancelButton: {
    padding: "12px 20px",
    background: "#ddd",
    color: "#333",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
  },
};

export default Notes;

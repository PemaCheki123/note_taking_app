import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      // ✅ Store both access and refresh tokens
      const { accessToken, refreshToken } = res.data;

      if (!accessToken || !refreshToken) {
        alert("Login failed: tokens not generated");
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Optional: log to verify
      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);

      navigate("/notes");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back!</h2>
        <p style={styles.subtitle}>Let’s pick up where you left off </p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <p style={styles.footerText}>
          New here?{" "}
          <Link to="/signup" style={styles.link}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "White",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "50px 40px",
    width: "360px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  title: {
    fontSize: "26px",
    marginBottom: "10px",
    color: "#333",
    fontWeight: 600,
  },
  subtitle: {
    fontSize: "15px",
    marginBottom: "30px",
    color: "#666",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "14px",
    transition: "all 0.2s",
    outline: "none",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
  },
  button: {
    padding: "12px",
    backgroundColor: "#5563DE",
    color: "#fff",
    fontWeight: 600,
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "15px",
    transition: "background 0.3s",
  },
  footerText: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#666",
  },
  link: {
    color: "#00bcd4",
    fontWeight: 600,
    textDecoration: "none",
  },
};

export default Login;

import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const Auth = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, type: isRegistering ? "register" : "login" }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 400, mx: "auto", textAlign: "center" }}>
      <Typography variant="h5">{isRegistering ? "Register" : "Login"}</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAuth}>
        {isRegistering ? "Register" : "Login"}
      </Button>
      <Button sx={{ mt: 2 }} onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
      </Button>
    </Box>
  );
};

export default Auth;

import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Button, TextField, IconButton, Select, MenuItem, Fab, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import FlagIcon from "@mui/icons-material/Flag";

const SECTIONS = ["Town Hall", "The Pub"];
const SORT_OPTIONS = ["Trending", "Most Liked", "Most Controversial", "Most Recent"];

export default function DiscussionBoard() {
  const [discussions, setDiscussions] = useState([]);
  const [newBody, setNewBody] = useState("");
  const [sort, setSort] = useState("Trending");
  const [section, setSection] = useState("Town Hall");
  const [loading, setLoading] = useState(false);
  const [showPostBox, setShowPostBox] = useState(false);

  useEffect(() => {
    fetchDiscussions();
  }, [sort, section]);

  const fetchDiscussions = async () => {
    setLoading(true);
    const res = await fetch(`/api/discussions?sort=${sort}&section=${section}`);
    const data = await res.json();
    setDiscussions(data);
    setLoading(false);
  };

  const handlePost = async () => {
    if (!newBody) return;
    const response = await fetch("/api/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: newBody, section, userId: "USER_ID_HERE" }) // Replace with actual user
    });

    if (response.ok) {
      fetchDiscussions();
      setNewBody("");
      setShowPostBox(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "600px", mx: "auto" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mt: 3 }}>TownSquare</Typography>

      {/* Sorting & Section Tabs */}
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
        <Select value={sort} onChange={(e) => setSort(e.target.value)}>{SORT_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}</Select>
        <Select value={section} onChange={(e) => setSection(e.target.value)}>{SECTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}</Select>
      </Box>

      {/* Post Input (Always Visible on Desktop) */}
      <Box sx={{ my: 2, display: { xs: "none", md: "block" } }}>
        <TextField fullWidth multiline rows={3} label="What's happening?" value={newBody} onChange={(e) => setNewBody(e.target.value)} />
        <Button variant="contained" sx={{ mt: 1 }} onClick={handlePost}>Post</Button>
      </Box>

      {/* Floating Post Button (Mobile) */}
      <Fab sx={{ position: "fixed", bottom: 16, right: 16, display: { xs: "flex", md: "none" } }} color="primary" onClick={() => setShowPostBox(!showPostBox)}>
        <AddIcon />
      </Fab>

      {/* Discussions */}
      {loading ? <CircularProgress /> : discussions.map((discussion) => (
        <Card key={discussion._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="body1">{discussion.body}</Typography>
            <Typography variant="caption">@{discussion.userId.username} | {discussion.section}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
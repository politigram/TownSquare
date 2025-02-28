import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, FormControlLabel, Checkbox } from "@mui/material";

const ContactOfficials = () => {
  const [zip, setZip] = useState("");
  const [officials, setOfficials] = useState(() => []);
  const [selectedOfficials, setSelectedOfficials] = useState([]);
  const [messages, setMessages] = useState({});

  // Fetch officials from local API
  const fetchOfficials = async () => {
    try {
      const res = await fetch(`/api/local-officials?zip=${zip}`);
      if (!res.ok) throw new Error("Failed to fetch officials");
      const data = await res.json();
      setOfficials(data);
    } catch (error) {
      console.error("Error fetching officials:", error);
    }
  };

  // Handle checkbox selection
  const handleCheckboxChange = (official) => {
    setSelectedOfficials((prev) =>
      prev.includes(official.name)
        ? prev.filter((name) => name !== official.name)
        : [...prev, official.name]
    );
  };

  // Handle message input change
  const handleMessageChange = (official, message) => {
    setMessages((prev) => ({ ...prev, [official.name]: message }));
  };

  // Send email directly or copy message & open contact form
  const handleSendMessage = (official) => {
    if (!messages[official.name]) {
      alert("Please enter your message before proceeding.");
      return;
    }
    
    if (official.email) {
      // Send email directly if available
      window.location.href = `mailto:${official.email}?subject=Message from Constituent&body=${encodeURIComponent(messages[official.name])}`;
    } else {
      // Copy message and redirect to contact form
      navigator.clipboard.writeText(messages[official.name]);
      alert("Message copied! Now paste it into the official's contact form.");
      window.open(official.contact_form, "_blank");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5">Contact Your Elected Officials</Typography>

      {/* ZIP Code Input */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <TextField
          label="Enter ZIP Code"
          variant="outlined"
          fullWidth
          value={zip}
          onChange={(e) => setZip(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={fetchOfficials}
        >
          Find Officials
        </Button>
      </Box>

      {/* Officials List */}
      {officials && officials.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {officials.map((official) => (
            <Box key={official.name} sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: "8px" }}>
              <Typography variant="h6">{official.name} ({official.party})</Typography>
              <Typography variant="subtitle1">{official.office}</Typography>
              <Typography variant="body2">Phone: {official.phone || "N/A"}</Typography>
              <Typography variant="body2">Address: {official.address || "N/A"}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOfficials.includes(official.name)}
                    onChange={() => handleCheckboxChange(official)}
                  />
                }
                label={<strong>Contact this official</strong>}
              />
              
              {/* Show TextField Only if Official is Selected */}
              {selectedOfficials.includes(official.name) && (
                <Box sx={{ mt: 1 }}>
                  <TextField
                    label="Message"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={messages[official.name] || ""}
                    onChange={(e) => handleMessageChange(official, e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2 }}
                    onClick={() => handleSendMessage(official)}
                  >
                    Send
                  </Button>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ContactOfficials;


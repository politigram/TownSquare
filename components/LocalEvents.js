import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

const LocalEvents = ({ events }) => {
  return (
    <Box sx={{ p: 3 }}>
      {events.length === 0 ? (
        <Typography>No upcoming events found.</Typography>
      ) : (
        events.map((event) => (
          <Card key={event.id} sx={{ mb: 2, bgcolor: "#FFFFFF" }}>
            <CardContent>
              <Typography variant="h6">{event.title}</Typography>
              <Typography variant="body2">{event.date} - {event.location}</Typography>
              <Typography variant="body2" sx={{ color: "#2F3640" }}>{event.description}</Typography>
              <Button href={event.link} target="_blank" sx={{ mt: 1 }}>View Details</Button>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default LocalEvents;

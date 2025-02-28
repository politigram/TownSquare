import React, { useState } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

const IdeologyTest = () => {
  const [progress, setProgress] = useState(0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Where Do You Stand?</Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />
    </Box>
  );
};

export default IdeologyTest;

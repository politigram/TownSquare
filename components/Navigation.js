import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link"; // ✅ Use Next.js Link

export default function Navigation() {
  return (
    <AppBar position="sticky" sx={{ bgcolor: "#1A3D7C" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: "#F5F5F5" }}>
          TownSquare
        </Typography>
        <Box>
          <Link href="/" passHref><Button sx={{ color: "#F5F5F5" }}>Home</Button></Link>
          <Link href="/discussion" passHref><Button sx={{ color: "#F5F5F5" }}>Discussion</Button></Link>
          <Link href="/local-events" passHref><Button sx={{ color: "#F5F5F5" }}>Local Events</Button></Link>
          <Link href="/contact-officials" passHref><Button sx={{ color: "#F5F5F5" }}>Contact Officials</Button></Link>
          <Link href="/political-wiki" passHref><Button sx={{ color: "#F5F5F5" }}>Wiki</Button></Link>
          <Link href="/ideology-test" passHref><Button sx={{ color: "#F5F5F5" }}>Where Do You Stand?</Button></Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

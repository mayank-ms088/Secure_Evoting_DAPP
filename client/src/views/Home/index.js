import { Box, Button, Typography } from "@material-ui/core";
import React from "react";
import { Content } from "./Content";
import TopBar from "./Header";
export default function Home() {
  return (
    <Box>
      <TopBar />
      <Content />
    </Box>
  );
}

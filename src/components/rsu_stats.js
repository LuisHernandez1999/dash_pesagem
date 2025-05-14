"use client"

import { Box, Card, CardContent, Typography, alpha } from "@mui/material"

const StatCard = ({ title, value, icon, color, highlight }) => {
  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        background: "white",
        height: "100%",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          transform: "translateY(-4px)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "3px",
          background: color,
          zIndex: 1,
        },
        animation: highlight ? `flashHighlight 1s ease-out` : `fadeIn 0.6s ease-out`,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: alpha(color, 0.1),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <CardContent sx={{ p: 3, pt: 4, pb: 5 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "2rem", sm: "2.5rem" },
            color: "#1e293b",
            mb: 1,
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#64748b",
            fontWeight: 500,
            fontSize: "0.95rem",
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default StatCard

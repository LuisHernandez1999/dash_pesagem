"use client"

import { Card, CardContent, CardHeader, Box, Typography, IconButton } from "@mui/material"
import { Refresh } from "@mui/icons-material"

export default function DashboardCard({
  title,
  subtitle,
  icon,
  iconColor,
  onRefresh,
  children,
  themeColors = {
    text: { primary: "#1e293b", secondary: "#64748b" },
    divider: "rgba(226, 232, 240, 0.8)",
    background: { card: "#ffffff" },
  },
}) {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s ease",
        overflow: "hidden",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-4px)",
        },
        background: themeColors.background?.card || "#ffffff",
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Box
              sx={{
                width: { xs: "32px", sm: "36px" },
                height: { xs: "32px", sm: "36px" },
                borderRadius: "12px",
                background: iconColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: `pulse 2s ease-in-out infinite`,
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1.1rem", sm: "1.2rem" },
                  color: themeColors.text?.primary || "#1e293b",
                }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.85rem" },
                  color: themeColors.text?.secondary || "#64748b",
                  fontWeight: 400,
                }}
              >
                {subtitle}
              </Typography>
            </Box>
          </Box>
        }
        action={
          <IconButton
            sx={{
              color: themeColors.text?.secondary || "#64748b",
              "&:hover": { color: iconColor },
            }}
            onClick={onRefresh}
          >
            <Refresh />
          </IconButton>
        }
        sx={{
          paddingBottom: "0.75rem",
          borderBottom: `1px solid ${themeColors.divider || "rgba(226, 232, 240, 0.8)"}`,
          "& .MuiCardHeader-title": {
            fontWeight: 600,
            fontSize: "1.125rem",
            color: themeColors.text?.primary || "#1e293b",
          },
          "& .MuiCardHeader-action": {
            margin: 0,
          },
        }}
      />
      <CardContent sx={{ padding: "1.5rem" }}>{children}</CardContent>
    </Card>
  )
}

import { Card, CardContent, Box, Typography, alpha } from "@mui/material"

export default function StatsCard({ title, value, subtitle, icon, color, delay }) {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: color.text?.primary || "#1e293b" }}>
              {title}
            </Typography>
            <Typography
              sx={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: color.main,
                mt: 1,
              }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(color.main, 0.12),
              color: color.main,
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography sx={{ color: color.text?.secondary || "#64748b", fontSize: "0.875rem" }}>{subtitle}</Typography>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardHeader, CardContent, Grid, Paper, Typography, alpha, useTheme } from "@mui/material"

const SummaryCard = ({ title, data, color, textColor }) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardHeader
        title={title}
        titleTypographyProps={{
          variant: "h6",
          fontWeight: 700,
          fontSize: "1rem",
          align: "center",
        }}
        sx={{
          backgroundColor: color,
          color: textColor,
          p: 2,
        }}
      />
      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {data.map((item, index) => (
            <Grid item xs={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.background.default, 0.7),
                  border: `1px solid ${theme.palette.divider}`,
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  {item.label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {item.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default SummaryCard

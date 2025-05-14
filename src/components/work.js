"use client"

import { Box, Card, CardHeader, CardContent, Typography, alpha, useTheme } from "@mui/material"

const WorkforceCard = ({ title, data, color, textColor }) => {
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
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: "flex",
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.background.default, 0.5),
          }}
        >
          <Typography sx={{ flex: "0 0 60px", fontWeight: 600, p: 1.5, fontSize: "0.875rem" }}>PA</Typography>
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5, fontSize: "0.875rem" }}>Prev. Mot.</Typography>
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5, fontSize: "0.875rem" }}>Real. Mot.</Typography>
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5, fontSize: "0.875rem" }}>Prev. Col.</Typography>
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5, fontSize: "0.875rem" }}>Real. Col.</Typography>
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5, fontSize: "0.875rem" }}>Faltas</Typography>
        </Box>
        {data.map((row, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              borderBottom: index < data.length - 1 ? `1px solid ${theme.palette.divider}` : "none",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <Typography sx={{ flex: "0 0 60px", p: 1.5, fontWeight: 500 }}>{row.pa}</Typography>
            <Typography sx={{ flex: 1, p: 1.5 }}>{row.previstoMotorista}</Typography>
            <Typography sx={{ flex: 1, p: 1.5 }}>{row.realizadoMotorista}</Typography>
            <Typography sx={{ flex: 1, p: 1.5 }}>{row.previstoColetores}</Typography>
            <Typography sx={{ flex: 1, p: 1.5 }}>{row.realizadoColetores}</Typography>
            <Typography sx={{ flex: 1, p: 1.5 }}>{row.faltas}</Typography>
          </Box>
        ))}
        <Box
          sx={{
            display: "flex",
            borderTop: `2px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.background.default, 0.5),
          }}
        >
          <Typography sx={{ flex: "0 0 60px", fontWeight: 600, p: 1.5 }}>Total</Typography>
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5 }}>
            {data.reduce((sum, row) => sum + row.previstoMotorista, 0)}
          </Typography>
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5 }}>
            {data.reduce((sum, row) => sum + row.realizadoMotorista, 0)}
          </Typography>
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5 }}>
            {data.reduce((sum, row) => sum + row.previstoColetores, 0)}
          </Typography>
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5 }}>
            {data.reduce((sum, row) => sum + row.realizadoColetores, 0)}
          </Typography>
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5 }}>
            {data.reduce((sum, row) => sum + row.faltas, 0)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default WorkforceCard

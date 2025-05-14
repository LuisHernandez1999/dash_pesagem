"use client"

import { Box, Card, CardHeader, CardContent, Typography, alpha, useTheme } from "@mui/material"

const EquipmentCard = ({ title, data, color, textColor }) => {
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
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5, fontSize: "0.875rem" }}>Previsto</Typography>
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5, fontSize: "0.875rem" }}>Realizado</Typography>
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5, fontSize: "0.875rem" }}>Manutenção</Typography>
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5, fontSize: "0.875rem" }}>Reservas</Typography>
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
            <Typography sx={{ flex: 1, p: 1.5 }}>{row.previsto}</Typography>
            <Typography sx={{ flex: 1, p: 1.5 }}>{row.realizado}</Typography>
            <Typography sx={{ flex: 1, p: 1.5 }}>{row.manutencao}</Typography>
            <Typography sx={{ flex: 1, p: 1.5 }}>{row.reservas}</Typography>
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
            {data.reduce((sum, row) => sum + row.previsto, 0)}
          </Typography>
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5 }}>
            {data.reduce((sum, row) => sum + row.realizado, 0)}
          </Typography>
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5 }}>
            {data.reduce((sum, row) => sum + row.manutencao, 0)}
          </Typography>
          <Typography sx={{ flex: 1, fontWeight: 600, p: 1.5 }}>
            {data.reduce((sum, row) => sum + row.reservas, 0)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default EquipmentCard

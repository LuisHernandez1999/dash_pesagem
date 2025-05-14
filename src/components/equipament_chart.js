"use client"

import { Card, CardHeader, CardContent, CircularProgress, useTheme } from "@mui/material"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const EquipmentChart = ({ title, data, themeColors, chartsLoaded }) => {
  const theme = useTheme()

  if (!chartsLoaded) {
    return (
      <Card
        sx={{
          height: "100%",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <CircularProgress />
      </Card>
    )
  }

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s ease",
        overflow: "hidden",
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
          fontWeight: 600,
          fontSize: "1rem",
        }}
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      />
      <CardContent sx={{ p: 2, height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="previsto" name="Previsto" fill={themeColors.primary.main} radius={[4, 4, 0, 0]} />
            <Bar dataKey="realizado" name="Realizado" fill={themeColors.success.main} radius={[4, 4, 0, 0]} />
            <Bar dataKey="manutencao" name="Manutenção" fill={themeColors.warning.main} radius={[4, 4, 0, 0]} />
            <Bar dataKey="reservas" name="Reservas" fill={themeColors.error.main} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default EquipmentChart

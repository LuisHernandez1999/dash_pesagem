"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Card, alpha } from "@mui/material"
import { WbSunny, Brightness3, Brightness4, People } from "@mui/icons-material"

const ShiftDistributionChart = ({ themeColors, chartsLoaded }) => {
  // Mock data for shift distribution
  const [data, setData] = useState({
    morning: {
      drivers: 5,
      collectors: 6,
    },
    afternoon: {
      drivers: 4,
      collectors: 4,
    },
    night: {
      drivers: 3,
      collectors: 3,
    },
  })

  // Simulate data loading
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update the data to simulate real-time changes
      setData({
        morning: {
          drivers: Math.floor(Math.random() * 2) + 4, // 4-5 drivers
          collectors: Math.floor(Math.random() * 2) + 5, // 5-6 collectors
        },
        afternoon: {
          drivers: Math.floor(Math.random() * 2) + 3, // 3-4 drivers
          collectors: Math.floor(Math.random() * 2) + 3, // 3-4 collectors
        },
        night: {
          drivers: Math.floor(Math.random() * 2) + 2, // 2-3 drivers
          collectors: Math.floor(Math.random() * 2) + 2, // 2-3 collectors
        },
      })
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Calculate totals
  const totalDrivers = data.morning.drivers + data.afternoon.drivers + data.night.drivers
  const totalCollectors = data.morning.collectors + data.afternoon.collectors + data.night.collectors
  const totalEmployees = totalDrivers + totalCollectors

  // Calculate percentages for each shift
  const morningPercentage = ((data.morning.drivers + data.morning.collectors) / totalEmployees) * 100
  const afternoonPercentage = ((data.afternoon.drivers + data.afternoon.collectors) / totalEmployees) * 100
  const nightPercentage = ((data.night.drivers + data.night.collectors) / totalEmployees) * 100

  // Shift card component
  const ShiftCard = ({ title, icon: Icon, color, driverCount, collectorCount, percentage, total }) => (
    <Card
      elevation={0}
      sx={{
        borderRadius: "12px",
        backgroundColor: alpha(color, 0.05),
        border: `1px solid ${alpha(color, 0.1)}`,
        height: "100%",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-4px)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderBottom: `1px solid ${alpha(color, 0.1)}`,
        }}
      >
        <Box
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            backgroundColor: alpha(color, 0.1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
          }}
        >
          <Icon sx={{ color: color, fontSize: 24 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: color,
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography sx={{ fontWeight: 500, color: themeColors.text.secondary }}>Motoristas</Typography>
          <Typography sx={{ fontWeight: 700, color: themeColors.text.primary }}>{driverCount}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: 500, color: themeColors.text.secondary }}>Coletores</Typography>
          <Typography sx={{ fontWeight: 700, color: themeColors.text.primary }}>{collectorCount}</Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          backgroundColor: alpha(color, 0.1),
          borderTop: `1px solid ${alpha(color, 0.2)}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: "auto",
        }}
      >
        <Typography sx={{ fontWeight: 600, color: color }}>Total:</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 700, color: color, mr: 1 }}>{total}</Typography>
          <Box
            sx={{
              backgroundColor: alpha(color, 0.2),
              borderRadius: "12px",
              px: 1,
              py: 0.5,
            }}
          >
            <Typography sx={{ fontWeight: 600, color: color, fontSize: "0.75rem" }}>
              {Math.round(percentage)}%
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  )

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Shift Cards */}
      <Box sx={{ display: "flex", gap: 3, mb: 3, flex: 1 }}>
        {/* Morning Shift */}
        <Box sx={{ flex: 1 }}>
          <ShiftCard
            title="Matutino"
            icon={WbSunny}
            color={themeColors.warning.main}
            driverCount={data.morning.drivers}
            collectorCount={data.morning.collectors}
            percentage={morningPercentage}
            total={data.morning.drivers + data.morning.collectors}
          />
        </Box>

        {/* Afternoon Shift */}
        <Box sx={{ flex: 1 }}>
          <ShiftCard
            title="Vespertino"
            icon={Brightness4}
            color={themeColors.primary.main}
            driverCount={data.afternoon.drivers}
            collectorCount={data.afternoon.collectors}
            percentage={afternoonPercentage}
            total={data.afternoon.drivers + data.afternoon.collectors}
          />
        </Box>

        {/* Night Shift */}
        <Box sx={{ flex: 1 }}>
          <ShiftCard
            title="Noturno"
            icon={Brightness3}
            color={themeColors.info.main}
            driverCount={data.night.drivers}
            collectorCount={data.night.collectors}
            percentage={nightPercentage}
            total={data.night.drivers + data.night.collectors}
          />
        </Box>
      </Box>

      {/* Summary Row */}
      <Box
        sx={{
          borderRadius: "12px",
          backgroundColor: alpha(themeColors.success.main, 0.05),
          p: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: `1px solid ${alpha(themeColors.success.main, 0.1)}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: alpha(themeColors.success.main, 0.2),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <People sx={{ color: themeColors.success.main, fontSize: 28 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.success.main }}>
            Total de funcionários em operação:
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: alpha(themeColors.success.main, 0.2),
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: themeColors.success.main,
            }}
          >
            {totalEmployees}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default ShiftDistributionChart

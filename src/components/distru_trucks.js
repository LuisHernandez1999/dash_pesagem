"use client"
import { useState, useEffect } from "react"
import { Box, Typography, alpha, Paper } from "@mui/material"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import ConstructionIcon from "@mui/icons-material/Construction"
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep"

// Simplified Vehicle Distribution Chart Component - Cards and Chart only
const VehicleDistributionChart = ({ chartsLoaded, themeColors, data = { bau: 12, basculantes: 8, seletolix: 5 } }) => {
  const [animateChart, setAnimateChart] = useState(false)

  // Vehicle type icons and colors configuration
  const vehicleConfig = {
    bau: {
      icon: <LocalShippingIcon fontSize="small" />,
      color: themeColors.primary.main,
      label: "BAU",
    },
    basculantes: {
      icon: <ConstructionIcon fontSize="small" />,
      color: themeColors.success.main,
      label: "BASCULANTES",
    },
    seletolix: {
      icon: <DeleteSweepIcon fontSize="small" />,
      color: themeColors.warning.main,
      label: "SELETOLIX",
    },
  }

  // Transform data for the chart
  const chartData = [
    { name: "BAU", value: data.bau, color: vehicleConfig.bau.color },
    { name: "BASCULANTES", value: data.basculantes, color: vehicleConfig.basculantes.color },
    { name: "SELETOLIX", value: data.seletolix, color: vehicleConfig.seletolix.color },
  ]

  // Calculate total vehicles
  const totalVehicles = chartData.reduce((sum, item) => sum + item.value, 0)

  // Animation effect when data changes
  useEffect(() => {
    setAnimateChart(true)
    const timer = setTimeout(() => setAnimateChart(false), 800)
    return () => clearTimeout(timer)
  }, [data])

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <Paper
          elevation={3}
          sx={{
            p: 1.5,
            borderLeft: `4px solid ${data.color}`,
            minWidth: 180,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600 }}>
            {data.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Quantidade: <span style={{ fontWeight: 600, color: data.color }}>{data.value}</span>
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "text.secondary" }}>
            {Math.round((data.value / totalVehicles) * 100)}% do total
          </Typography>
        </Paper>
      )
    }
    return null
  }

  if (!chartsLoaded) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: 100,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: alpha(themeColors.info.main, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          />
        </Box>
      </Box>
    )
  }

  return (
    <>
      {/* Vehicle Type Cards */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          gap: 2,
        }}
      >
        {Object.entries(vehicleConfig).map(([key, config], index) => (
          <Paper
            key={key}
            elevation={1}
            sx={{
              p: 1.5,
              flex: 1,
              borderRadius: 1.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: alpha(config.color, 0.05),
              border: `1px solid ${alpha(config.color, 0.2)}`,
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: alpha(config.color, 0.2),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
                color: config.color,
              }}
            >
              {config.icon}
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: config.color,
                mb: 0.5,
                transition: "transform 0.5s ease",
                transform: animateChart ? "scale(1.2)" : "scale(1)",
              }}
            >
              {data[key]}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                color: themeColors.text.secondary,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {config.label}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Chart */}
      <Box
        sx={{
          height: 220,
          transition: "opacity 0.5s ease",
          opacity: animateChart ? 0.7 : 1,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barGap={8}
          >
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: themeColors.text.secondary, fontSize: 12 }}
              tickFormatter={(value) => value}
            />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              width={100}
              tick={{
                fill: themeColors.text.primary,
                fontSize: 12,
                fontWeight: 500,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1500}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                style={{
                  fill: themeColors.text.primary,
                  fontWeight: 600,
                  fontSize: 12,
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </>
  )
}

export default VehicleDistributionChart

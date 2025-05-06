"use client"
import { useState, useEffect, useRef } from "react"
import { Box, Typography, alpha, Paper, CircularProgress } from "@mui/material"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import ConstructionIcon from "@mui/icons-material/Construction"
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep"
import { getDistribuicaoPorTipoVeiculo } from "../service/dashboard"

// Simplified Vehicle Distribution Chart Component - Cards and Chart only
const VehicleDistributionChart = ({ chartsLoaded = true, themeColors }) => {
  const [vehicleData, setVehicleData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [animateChart, setAnimateChart] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Use a ref to store the previous data for comparison
  const prevDataRef = useRef(null)

  // Vehicle type icons and colors configuration
  const vehicleConfig = {
    Baú: {
      icon: <LocalShippingIcon fontSize="small" />,
      color: themeColors.primary.main,
      label: "BAÚ",
    },
    Basculante: {
      icon: <ConstructionIcon fontSize="small" />,
      color: themeColors.success.main,
      label: "BASCULANTE",
    },
    Seletolix: {
      icon: <DeleteSweepIcon fontSize="small" />,
      color: themeColors.warning.main,
      label: "SELETOLIX",
    },
  }

  // Helper function to check if data has changed
  const hasDataChanged = (oldData, newData) => {
    if (!oldData || !newData) return true

    for (const key in vehicleConfig) {
      if (!oldData[key] || !newData[key] || oldData[key] !== newData[key]) {
        return true
      }
    }

    return false
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await getDistribuicaoPorTipoVeiculo()

      console.log("API response:", response)

      // Check if there was an error in the response
      if (response.error) {
        console.error("Error from API:", response.error)
        setError(response.error)
        return
      }

      // Extract the count values directly from the API response
      const newData = {
        Basculante: response.Basculante?.contagem,
        Baú: response.Baú?.contagem,
        Seletolix: response.Seletolix?.contagem,
      }

      console.log("Extracted data:", newData)

      // Check if data has changed
      if (hasDataChanged(prevDataRef.current, newData)) {
        setVehicleData(newData)
        setAnimateChart(true)
        setLastUpdated(new Date())

        // Update the previous data reference
        prevDataRef.current = { ...newData }
      } else {
        console.log("Data hasn't changed, skipping update")
      }

      setError(null)
    } catch (err) {
      console.error("Failed to fetch vehicle distribution data:", err)
      setError("Falha ao carregar dados de distribuição de veículos")
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [])

  // Auto-refresh every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData()
    }, 5 * 60 * 1000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  // Animation effect when data changes
  useEffect(() => {
    if (animateChart) {
      const timer = setTimeout(() => setAnimateChart(false), 800)
      return () => clearTimeout(timer)
    }
  }, [animateChart])

  // Transform data for the chart
  const chartData = Object.keys(vehicleConfig).map((key) => ({
    name: vehicleConfig[key].label,
    value: vehicleData[key] || 0,
    color: vehicleConfig[key].color,
  }))

  // Calculate total vehicles
  const totalVehicles = chartData.reduce((sum, item) => sum + item.value, 0)

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
            {totalVehicles > 0 ? Math.round((data.value / totalVehicles) * 100) : 0}% do total
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
        <CircularProgress size={40} color="primary" />
      </Box>
    )
  }

  if (error) {
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
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  if (loading && Object.keys(vehicleData).length === 0) {
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
        <CircularProgress size={40} color="primary" />
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
          position: "relative",
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: -10,
              right: -10,
              zIndex: 10,
              backgroundColor: alpha(themeColors.info.main, 0.1),
              color: themeColors.info.main,
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            <span>Atualizando...</span>
          </Box>
        )}

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
              {vehicleData[key] || 0}
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
          position: "relative",
        }}
      >
        {lastUpdated && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              zIndex: 10,
              backgroundColor: alpha(themeColors.success.main, 0.1),
              color: themeColors.success.main,
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: 500,
            }}
          >
            <span>Atualizado: {lastUpdated.toLocaleTimeString()}</span>
          </Box>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }} barGap={8}>
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

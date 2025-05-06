"use client"

import { useEffect, useState, useRef } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts"
import { Box, Typography, Paper, Chip, Divider, IconButton, Fade, alpha } from "@mui/material"
import { Info, Refresh } from "@mui/icons-material"
import { Tooltip as MuiTooltip } from "@mui/material"
import { getDistribuicaoDiaria } from "../service/dashboard"

// Helper function to check if data has changed
const hasDataChanged = (oldData, newData) => {
  if (!oldData || !newData) return true

  // Compare the values of each PA
  for (const key in newData) {
    if (newData[key] !== oldData[key]) {
      return true
    }
  }

  return false
}

// PA Distribution Chart Component
const PADistributionChart = ({ chartsLoaded = true, themeColors }) => {
  const [paData, setPaData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Use a ref to store the previous raw data for comparison
  const prevRawDataRef = useRef(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching distribution data...")
      const distribuicaoPorPA = await getDistribuicaoDiaria()

      // Log the raw response
      console.log("Raw API response:", distribuicaoPorPA)

      // Check if data has changed from previous fetch
      const dataChanged = hasDataChanged(prevRawDataRef.current, distribuicaoPorPA)

      if (dataChanged) {
        console.log("Data has changed, updating chart...")

        // Transform API data to the format needed by the chart
        const transformedData = Object.entries(distribuicaoPorPA).map(([name, value], index) => {
          // Assign colors based on index
          const colors = [
            themeColors.info.main,
            themeColors.primary.main,
            themeColors.warning.main,
            themeColors.success.main,
          ]

          return {
            name,
            value: Number(value),
            color: colors[index % colors.length],
          }
        })

        console.log("Transformed data for chart:", transformedData)
        setPaData(transformedData)
        setLastUpdated(new Date())

        // Update the previous data reference
        prevRawDataRef.current = { ...distribuicaoPorPA }
      } else {
        console.log("Data has not changed, skipping update")
      }
    } catch (err) {
      console.error("Error fetching PA distribution data:", err)
      setError("Falha ao carregar dados de distribuição")
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
    }, 240000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  // Custom tooltip for the chart
  const PATooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            border: "none",
            borderRadius: "16px",
            padding: "1.2rem",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
            maxWidth: "280px",
            position: "relative",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: `linear-gradient(90deg, ${data.color}, ${alpha(data.color, 0.7)})`,
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.2rem",
              marginBottom: "0.75rem",
              color: themeColors.text.primary,
              borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
              paddingBottom: "0.5rem",
            }}
          >
            {data.name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "4px",
                  marginRight: "0.75rem",
                  backgroundColor: data.color,
                }}
              />
              <Typography sx={{ color: themeColors.text.secondary, fontWeight: 500 }}>Veículos:</Typography>
            </Box>
            <Typography sx={{ fontWeight: 600, color: themeColors.text.primary }}>{data.value}</Typography>
          </Box>
        </Box>
      )
    }
    return null
  }

  if (loading && paData.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Typography>Carregando dados de distribuição...</Typography>
      </Box>
    )
  }

  return (
    <Fade in={chartsLoaded} timeout={800}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Chart Section */}
        <Box
          sx={{
            flex: 1,
            height: { xs: "250px", md: "100%" },
            width: { xs: "100%", md: "60%" },
            position: "relative",
          }}
        >
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
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

          {paData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: themeColors.text.primary, fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip content={<PATooltip />} />
                <Bar dataKey="value" name="Veículos" radius={[0, 4, 4, 0]} barSize={30}>
                  {paData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      filter={`drop-shadow(0px 2px 3px ${alpha(entry.color, 0.3)})`}
                    />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="right"
                    fill={themeColors.text.primary}
                    fontSize={12}
                    fontWeight={600}
                    formatter={(value) => `${value} veículos`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <Typography>Nenhum dado de distribuição disponível</Typography>
            </Box>
          )}
        </Box>

        {/* Stats Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 2,
            width: { xs: "100%", md: "40%" },
          }}
        >
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: themeColors.text.primary,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Distribuição de Veículos por Garagem
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <MuiTooltip title="Atualizar dados">
                  <IconButton size="small" onClick={fetchData}>
                    <Refresh fontSize="small" />
                  </IconButton>
                </MuiTooltip>
                <MuiTooltip title="Dados atualizados a cada 3 segundos">
                  <IconButton size="small">
                    <Info fontSize="small" />
                  </IconButton>
                </MuiTooltip>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {paData.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(2, 1fr)" },
                  gap: 2,
                }}
              >
                {paData.map((item) => (
                  <Paper
                    key={item.name}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: "16px",
                      border: `1px solid ${themeColors.divider}`,
                      background: alpha(item.color, 0.05),
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 8px 16px ${alpha(item.color, 0.15)}`,
                        border: `1px solid ${alpha(item.color, 0.3)}`,
                      },
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "5px",
                        height: "100%",
                        background: item.color,
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mb: 1 }}>
                      <Chip
                        label={item.name}
                        size="small"
                        sx={{
                          backgroundColor: alpha(item.color, 0.1),
                          color: item.color,
                          fontWeight: 600,
                          height: "24px",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: item.color,
                        mb: 0.5,
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 4 }}>
                <Typography>Nenhum dado disponível</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Fade>
  )
}

export default PADistributionChart

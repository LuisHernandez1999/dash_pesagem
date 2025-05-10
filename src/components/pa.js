"use client"

import { useEffect, useState, useRef } from "react"
import { Box, Typography, Card, Fade, alpha, Chip, Divider } from "@mui/material"
import { Warehouse } from "@mui/icons-material"
import { contarSolturasPorGaragemHoje } from "../service/dashboard"

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
      const distribuicaoPorPA = await contarSolturasPorGaragemHoje()

      // Log the raw response
      console.log("Raw API response:", distribuicaoPorPA)

      // Check if data has changed from previous fetch
      const dataChanged = hasDataChanged(prevRawDataRef.current, distribuicaoPorPA)

      if (dataChanged) {
        console.log("Data has changed, updating chart...")

        // Transform API data to the format needed by the chart
        const transformedData = Object.entries(distribuicaoPorPA)
          .filter(([key]) => key !== "total") // Exclude the total from individual cards
          .map(([name, value], index) => {
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

  // Auto-refresh every 4 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData()
    }, 240000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  // Calculate total vehicles
  const totalVehicles = paData.reduce((sum, item) => sum + item.value, 0)

  if (loading && paData.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Typography>Carregando dados de distribuição...</Typography>
      </Box>
    )
  }

  return (
    <Fade in={chartsLoaded} timeout={800}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ mb: 2 }}></Box>

        <Divider sx={{ mb: 3 }} />

        {paData.length > 0 ? (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)" },
                gap: 3,
                mb: 3,
              }}
            >
              {paData.map((item) => (
                <Card
                  key={item.name}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    border: `1px solid ${themeColors.divider}`,
                    backgroundColor: alpha(item.color, 0.05),
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                      transform: "translateY(-4px)",
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                    <Box
                      sx={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        backgroundColor: alpha(item.color, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Warehouse sx={{ color: item.color, fontSize: 24 }} />
                    </Box>
                    <Typography sx={{ fontWeight: 600, color: item.color, fontSize: "1.1rem" }}>{item.name}</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "2.5rem", color: themeColors.text.primary, mb: 1 }}>
                    {item.value}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontSize: "0.9rem", color: themeColors.text.secondary }}>
                      Veículos soltos
                    </Typography>
                    <Chip
                      label={`${item.name}`}
                      size="small"
                      sx={{
                        backgroundColor: alpha(item.color, 0.1),
                        color: item.color,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Card>
              ))}
            </Box>

            <Box sx={{ mt: "auto" }}>
              <Card
                elevation={0}
                sx={{
                  p: 2,
                  width: "100%",
                  borderRadius: "16px",
                  border: `1px solid ${themeColors.divider}`,
                  backgroundColor: alpha(themeColors.info.main, 0.05),
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ fontWeight: 600, color: themeColors.info.main }}>
                    Saidas registradas por P.A:
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: themeColors.info.main }}>
                    {totalVehicles}
                  </Typography>
                </Box>
                {lastUpdated && (
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: themeColors.text.secondary,
                      mt: 1,
                      textAlign: "right",
                    }}
                  >
                    Atualizado: {lastUpdated.toLocaleTimeString()}
                  </Typography>
                )}
              </Card>
            </Box>
          </>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 4 }}>
            <Typography>Nenhum dado disponível</Typography>
          </Box>
        )}
      </Box>
    </Fade>
  )
}

export default PADistributionChart

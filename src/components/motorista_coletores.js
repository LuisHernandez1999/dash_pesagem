"use client"

import { useEffect, useState, useRef } from "react"
import { Box, Typography, Fade, alpha, Chip, Divider, Card, CircularProgress } from "@mui/material"
import { Person, Group } from "@mui/icons-material"
import { contarMotoristasEColetorsHoje } from "../service/dashboard"

const DriverCollectorExitChart = ({ themeColors, chartsLoaded }) => {
  const [data, setData] = useState({
    total_motoristas: 0,
    total_coletores: 0,
    total_geral: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Use a ref to store the previous data for comparison
  const prevDataRef = useRef(null)

  // Helper function to check if data has changed
  const hasDataChanged = (oldData, newData) => {///oi
    if (!oldData || !newData) return true

    return (
      oldData.total_motoristas !== newData.total_motoristas ||
      oldData.total_coletores !== newData.total_coletores ||
      oldData.total_geral !== newData.total_geral
    )
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching drivers and collectors data...")
      const result = await contarMotoristasEColetorsHoje()

      // Check if data has changed from previous fetch
      const dataChanged = hasDataChanged(prevDataRef.current, result)

      if (dataChanged) {
        console.log("Data has changed, updating chart...")
        setData(result)
        setLastUpdated(new Date())

        // Update the previous data reference
        prevDataRef.current = { ...result }
      } else {
        console.log("Data has not changed, skipping update")
      }
    } catch (err) {
      console.error("Error fetching drivers and collectors data:", err)
      setError("Falha ao carregar dados de motoristas e coletores")
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

  return (
    <Fade in={chartsLoaded} timeout={800}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Divider sx={{ mb: 3 }}>
          <Chip
            label="Saídas de Funcionários"
            size="small"
            sx={{
              backgroundColor: alpha(themeColors.success.main, 0.1),
              color: themeColors.success.main,
              fontWeight: 600,
            }}
          />
        </Divider>

        {loading && data.total_geral === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <CircularProgress size={40} sx={{ color: themeColors.primary.main }} />
          </Box>
        ) : error ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              <Card
                elevation={0}
                sx={{
                  p: 2,
                  flex: "1 1 calc(50% - 12px)",
                  borderRadius: "16px",
                  border: `1px solid ${themeColors.divider}`,
                  backgroundColor: alpha(themeColors.primary.main, 0.05),
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      backgroundColor: alpha(themeColors.primary.main, 0.1),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Person sx={{ color: themeColors.primary.main, fontSize: 24 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 600, color: themeColors.primary.main, fontSize: "1.1rem" }}>
                    Motoristas que Saíram
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: "2.5rem", color: themeColors.text.primary, mb: 1 }}>
                  {data.total_motoristas}
                </Typography>
              </Card>

              <Card
                elevation={0}
                sx={{
                  p: 2,
                  flex: "1 1 calc(50% - 12px)",
                  borderRadius: "16px",
                  border: `1px solid ${themeColors.divider}`,
                  backgroundColor: alpha(themeColors.secondary.main, 0.05),
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      backgroundColor: alpha(themeColors.secondary.main, 0.1),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Group sx={{ color: themeColors.secondary.main, fontSize: 24 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 600, color: themeColors.secondary.main, fontSize: "1.1rem" }}>
                    Coletores que Saíram
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: "2.5rem", color: themeColors.text.primary, mb: 1 }}>
                  {data.total_coletores}
                </Typography>
              </Card>
            </Box>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Card
                elevation={0}
                sx={{
                  p: 2,
                  width: "100%",
                  borderRadius: "16px",
                  border: `1px solid ${themeColors.divider}`,
                  backgroundColor: alpha(themeColors.success.main, 0.05),
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ fontWeight: 600, color: themeColors.success.main }}>
                    Total de Funcionários que Saíram:
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: themeColors.success.main }}>
                    {data.total_geral}
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
        )}
      </Box>
    </Fade>
  )
}

export default DriverCollectorExitChart

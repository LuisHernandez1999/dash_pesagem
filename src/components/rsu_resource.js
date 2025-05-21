"use client"

import { useState, useEffect, useRef } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Skeleton,
  alpha,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material"
import {
  Refresh,
  DirectionsCar,
  Person,
  Group,
  CheckCircle,
  Schedule,
  TrendingUp,
  TrendingDown,
  LocationOn,
} from "@mui/icons-material"
import { getContagemPorPaRsu } from "../service/rsu"

// Helper function to check if data has changed
const hasDataChanged = (oldData, newData) => {
  if (!oldData || !newData) return true

  // Compare the values of each key
  for (const key in newData) {
    if (JSON.stringify(newData[key]) !== JSON.stringify(oldData[key])) {
      return true
    }
  }

  return false
}

const RSUResourceComparisonStats = ({ themeColors, keyframes, onRefresh }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState({
    PA1: {
      coletores: 0,
      motoristas: 0,
      veiculos: 0,
      turnos: [],
    },
    PA2: {
      coletores: 0,
      motoristas: 0,
      veiculos: 0,
      turnos: [],
    },
    PA3: {
      coletores: 0,
      motoristas: 0,
      veiculos: 0,
      turnos: [],
    },
    PA4: {
      coletores: 0,
      motoristas: 0,
      veiculos: 0,
      turnos: [],
    },
    lastUpdated: "",
  })
  const [activeTab, setActiveTab] = useState(0)

  // Use ref to store previous data for comparison
  const prevDataRef = useRef(null)

  // Fixed expected values for RSU
  const expectedValues = {
    coletores: 60,
    motoristas: 20,
    veiculos: 20,
  }

  const loadData = async () => {
    try {
      setLoading(true)
      console.log("Carregando dados de recursos RSU...")

      // Fetch data from API
      const apiData = await getContagemPorPaRsu()
      console.log("Dados recebidos da API:", apiData)

      // Check if data has changed
      const dataChanged = hasDataChanged(prevDataRef.current, apiData)

      if (dataChanged) {
        console.log("Dados mudaram, atualizando componente...")

        // Add lastUpdated timestamp
        const transformedData = {
          ...apiData,
          lastUpdated: new Date().toISOString(),
        }

        setData(transformedData)
        setError(null)

        // Update ref with current data
        prevDataRef.current = { ...apiData }
      } else {
        console.log("Dados não mudaram, pulando atualização")
      }
    } catch (err) {
      console.error("Erro ao carregar dados de comparação de recursos RSU:", err)
      setError("Falha ao carregar dados")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    // Set up refresh interval (5 minutes)
    const refreshInterval = setInterval(
      () => {
        loadData()
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(refreshInterval)
  }, [])

  const handleRefresh = () => {
    loadData()
    if (onRefresh) onRefresh()
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      return ""
    }
  }

  // Calculate percentages and differences
  const calculateStats = (expected, actual) => {
    const percentage = expected > 0 ? Math.round((actual / expected) * 100) : 0
    const difference = actual - expected
    const isPositive = difference >= 0

    return {
      percentage,
      difference,
      isPositive,
    }
  }

  // PA colors - using RSU theme colors
  const paColors = {
    PA1: { main: themeColors.primary.main, light: alpha(themeColors.primary.main, 0.06) },
    PA2: { main: themeColors.info.main, light: alpha(themeColors.info.main, 0.06) },
    PA3: { main: themeColors.warning.main, light: alpha(themeColors.warning.main, 0.06) },
    PA4: { main: themeColors.secondary.main, light: alpha(themeColors.secondary.main, 0.06) },
  }

  // Resource types with icons
  const resourceTypes = [
    {
      key: "coletores",
      title: "Coletores",
      icon: <Group />,
    },
    {
      key: "motoristas",
      title: "Motoristas",
      icon: <Person />,
    },
    {
      key: "veiculos",
      title: "Veículos",
      icon: <DirectionsCar />,
    },
  ]

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Get PA names as an array
  const paNames = Object.keys(data).filter((key) => key !== "lastUpdated")

  // Get active PA data
  const getActivePAData = () => {
    if (activeTab === 0) {
      // All PAs view
      return paNames
    } else {
      // Single PA view
      return [paNames[activeTab - 1]]
    }
  }

  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05)",
        mb: 4,
        background: themeColors.background.card,
        position: "relative",
        border: "none",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Box
              sx={{
                width: { xs: "32px", sm: "36px" },
                height: { xs: "32px", sm: "36px" },
                borderRadius: "12px",
                background: themeColors.primary.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: `${keyframes.pulse} 2s ease-in-out infinite`,
              }}
            >
              <CheckCircle
                sx={{
                  color: "white",
                  fontSize: { xs: "1.1rem", sm: "1.3rem" },
                }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1.1rem", sm: "1.2rem" },
                  color: themeColors.text.primary,
                }}
              >
                Comparativo de Recursos por PA
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.85rem" },
                  color: themeColors.text.secondary,
                  fontWeight: 400,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Recursos previstos vs. disponíveis para coleta domiciliar
                {data.lastUpdated && !loading && (
                  <Box component="span" sx={{ ml: 1, display: "inline-flex", alignItems: "center" }}>
                    <Schedule sx={{ fontSize: "0.75rem", mr: 0.5, color: themeColors.text.secondary }} />
                    {formatDate(data.lastUpdated)}
                  </Box>
                )}
              </Typography>
            </Box>
          </Box>
        }
        action={
          <Tooltip title="Atualizar dados">
            <IconButton
              sx={{
                color: themeColors.text.secondary,
                "&:hover": { color: themeColors.primary.main },
                width: 36,
                height: 36,
              }}
              onClick={handleRefresh}
              disabled={loading}
            >
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>
        }
        sx={{
          paddingBottom: "0.75rem",
          borderBottom: `1px solid ${themeColors.divider}`,
          "& .MuiCardHeader-title": {
            fontWeight: 600,
            fontSize: "1.125rem",
            color: themeColors.text.primary,
          },
          "& .MuiCardHeader-action": {
            margin: 0,
          },
        }}
      />

      <CardContent sx={{ padding: "1.5rem", pt: "1rem" }}>
        {loading &&
        Object.values(data).every((pa) => pa.coletores === 0 && pa.motoristas === 0 && pa.veiculos === 0) ? (
          <Box sx={{ py: 2 }}>
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: "8px", mb: 2 }} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            {/* PA Tabs */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                mb: 2,
                "& .MuiTabs-indicator": {
                  backgroundColor: themeColors.primary.main,
                  height: 2,
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  color: themeColors.text.secondary,
                  "&.Mui-selected": {
                    color: themeColors.primary.main,
                    fontWeight: 600,
                  },
                  minWidth: 80,
                  py: 1,
                },
              }}
            >
              <Tab label="Todos PAs" sx={{ display: "flex", alignItems: "center", gap: 0.5 }} />
              {paNames.map((pa, index) => (
                <Tab
                  key={pa}
                  label={pa}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: activeTab === index + 1 ? paColors[pa].main : themeColors.text.secondary,
                    "&.Mui-selected": {
                      color: paColors[pa].main,
                    },
                  }}
                />
              ))}
            </Tabs>

            {/* PA Data */}
            {getActivePAData().map((pa) => (
              <Box key={pa} sx={{ mb: activeTab === 0 ? 3 : 0 }}>
                {activeTab === 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "6px",
                        backgroundColor: paColors[pa].light,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1,
                      }}
                    >
                      <LocationOn sx={{ color: paColors[pa].main, fontSize: "1rem" }} />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: paColors[pa].main,
                      }}
                    >
                      {pa}
                    </Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "transparent",
                    mb: activeTab === 0 ? 2 : 0,
                    border: `1px solid ${alpha(themeColors.text.primary, 0.08)}`,
                    boxShadow: `0 2px 8px ${alpha(themeColors.primary.main, 0.05)}`,
                  }}
                >
                  {/* Header Row */}
                  <Box
                    sx={{
                      display: "flex",
                      backgroundColor: alpha(themeColors.text.primary, 0.03),
                      p: 1.5,
                    }}
                  >
                    <Box sx={{ width: "30%", pl: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          color: themeColors.text.secondary,
                        }}
                      >
                        Recurso
                      </Typography>
                    </Box>
                    <Box sx={{ width: "20%", textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          color: themeColors.text.secondary,
                        }}
                      >
                        Previstos
                      </Typography>
                    </Box>
                    <Box sx={{ width: "20%", textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          color: themeColors.text.secondary,
                        }}
                      >
                        Disponíveis
                      </Typography>
                    </Box>
                    <Box sx={{ width: "30%", textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          color: themeColors.text.secondary,
                        }}
                      >
                        Progresso
                      </Typography>
                    </Box>
                  </Box>

                  {/* Resource Rows */}
                  {resourceTypes.map((resource, index) => {
                    const actualValue = data[pa][resource.key]
                    const expectedValue = expectedValues[resource.key]
                    const stats = calculateStats(expectedValue, actualValue)
                    const progressColor =
                      stats.percentage >= 90
                        ? themeColors.success.main
                        : stats.percentage >= 70
                          ? themeColors.warning.main
                          : themeColors.error.main

                    return (
                      <Box
                        key={resource.key}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 1.5,
                          backgroundColor: index % 2 === 0 ? "transparent" : alpha(themeColors.text.primary, 0.01),
                          borderTop: index > 0 ? `1px solid ${alpha(themeColors.text.primary, 0.05)}` : "none",
                        }}
                      >
                        {/* Resource Name */}
                        <Box sx={{ width: "30%", display: "flex", alignItems: "center", pl: 1 }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "6px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: alpha(paColors[pa].main, 0.08),
                              color: paColors[pa].main,
                              mr: 1.5,
                            }}
                          >
                            {resource.icon}
                          </Box>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: "0.9rem",
                              color: themeColors.text.primary,
                            }}
                          >
                            {resource.title}
                          </Typography>
                        </Box>

                        {/* Expected */}
                        <Box sx={{ width: "20%", textAlign: "center" }}>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "1.1rem",
                              color: themeColors.text.primary,
                            }}
                          >
                            {expectedValue}
                          </Typography>
                        </Box>

                        {/* Actual */}
                        <Box sx={{ width: "20%", textAlign: "center" }}>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "1.1rem",
                              color: paColors[pa].main,
                            }}
                          >
                            {actualValue}
                          </Typography>
                        </Box>

                        {/* Progress */}
                        <Box sx={{ width: "30%", px: 1.5 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5, alignItems: "center" }}>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.8rem",
                                color: progressColor,
                              }}
                            >
                              {stats.percentage}%
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: "0.75rem",
                                color: stats.isPositive ? themeColors.success.main : themeColors.error.main,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {stats.isPositive ? (
                                <TrendingUp sx={{ fontSize: "0.875rem", mr: 0.25 }} />
                              ) : (
                                <TrendingDown sx={{ fontSize: "0.875rem", mr: 0.25 }} />
                              )}
                              {stats.isPositive ? "+" : ""}
                              {stats.difference}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: alpha(progressColor, 0.15),
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                height: "100%",
                                width: `${Math.min(stats.percentage, 100)}%`,
                                backgroundColor: progressColor,
                                borderRadius: 3,
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default RSUResourceComparisonStats

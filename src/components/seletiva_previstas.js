"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Skeleton,
  alpha,
  Paper,
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
  InfoOutlined,
  LocationOn,
} from "@mui/icons-material"

// Mock API function - replace with actual API call
const fetchResourceComparisonByPA = async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data organized by PA
  return {
    success: true,
    data: {
      PA1: {
        collectors: { expected: 40, actual: 35 },
        drivers: { expected: 15, actual: 14 },
        vehicles: { expected: 15, actual: 14 },
      },
      PA2: {
        collectors: { expected: 30, actual: 28 },
        drivers: { expected: 12, actual: 11 },
        vehicles: { expected: 12, actual: 11 },
      },
      PA3: {
        collectors: { expected: 25, actual: 22 },
        drivers: { expected: 10, actual: 9 },
        vehicles: { expected: 13, actual: 12 },
      },
      PA4: {
        collectors: { expected: 25, actual: 20 },
        drivers: { expected: 8, actual: 8 },
        vehicles: { expected: 10, actual: 9 },
      },
      lastUpdated: new Date().toISOString(),
    },
  }
}

const ResourceComparisonStats = ({ themeColors, keyframes, onRefresh }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState({
    PA1: {
      collectors: { expected: 0, actual: 0 },
      drivers: { expected: 0, actual: 0 },
      vehicles: { expected: 0, actual: 0 },
    },
    PA2: {
      collectors: { expected: 0, actual: 0 },
      drivers: { expected: 0, actual: 0 },
      vehicles: { expected: 0, actual: 0 },
    },
    PA3: {
      collectors: { expected: 0, actual: 0 },
      drivers: { expected: 0, actual: 0 },
      vehicles: { expected: 0, actual: 0 },
    },
    PA4: {
      collectors: { expected: 0, actual: 0 },
      drivers: { expected: 0, actual: 0 },
      vehicles: { expected: 0, actual: 0 },
    },
    lastUpdated: "",
  })
  const [activeTab, setActiveTab] = useState(0)

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetchResourceComparisonByPA()

      if (response.success) {
        setData(response.data)
        setError(null)
      } else {
        setError("Erro ao carregar dados de comparação de recursos")
      }
    } catch (err) {
      console.error("Erro ao carregar dados de comparação:", err)
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

  // PA colors
  const paColors = {
    PA1: themeColors.primary,
    PA2: themeColors.info,
    PA3: themeColors.warning,
    PA4: themeColors.secondary,
  }

  // Resource types with icons
  const resourceTypes = [
    {
      key: "collectors",
      title: "Coletores",
      icon: <Group />,
    },
    {
      key: "drivers",
      title: "Motoristas",
      icon: <Person />,
    },
    {
      key: "vehicles",
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
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s ease",
        overflow: "hidden",
        mb: 4,
        "&:hover": {
          boxShadow: "0 12px 48px rgba(0, 0, 0, 0.08)",
        },
        background: themeColors.background.card,
        position: "relative",
        border: "none",
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
                background: themeColors.secondary.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                  letterSpacing: "-0.01em",
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
                Previstos vs. Realizados
                {data.lastUpdated && !loading && (
                  <Box component="span" sx={{ ml: 1, display: "inline-flex", alignItems: "center" }}>
                    <Schedule sx={{ fontSize: "0.875rem", mr: 0.5, color: themeColors.text.secondary }} />
                    Atualizado: {formatDate(data.lastUpdated)}
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
                width: 40,
                height: 40,
                backgroundColor: alpha(themeColors.primary.main, 0.05),
                "&:hover": {
                  backgroundColor: alpha(themeColors.primary.main, 0.1),
                  color: themeColors.primary.main,
                },
                transition: "all 0.2s ease",
              }}
              onClick={handleRefresh}
              disabled={loading}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        }
        sx={{
          padding: "1.25rem 1.5rem",
          borderBottom: `1px solid ${alpha(themeColors.text.primary, 0.06)}`,
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

      <CardContent sx={{ padding: "1.5rem" }}>
        {loading ? (
          <Box sx={{ py: 2 }}>
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: "12px", mb: 2 }} />
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
                mb: 3,
                "& .MuiTabs-indicator": {
                  backgroundColor: themeColors.primary.main,
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: themeColors.text.secondary,
                  "&.Mui-selected": {
                    color: themeColors.primary.main,
                  },
                  minWidth: 100,
                },
              }}
            >
              <Tab
                label="Todos PAs"
                icon={<LocationOn />}
                iconPosition="start"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              />
              {paNames.map((pa, index) => (
                <Tab
                  key={pa}
                  label={pa}
                  icon={<LocationOn />}
                  iconPosition="start"
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
              <Box key={pa} sx={{ mb: activeTab === 0 ? 4 : 0 }}>
                {activeTab === 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        backgroundColor: alpha(paColors[pa].main, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1.5,
                      }}
                    >
                      <LocationOn sx={{ color: paColors[pa].main, fontSize: "1.2rem" }} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: paColors[pa].main,
                      }}
                    >
                      {pa}
                    </Typography>
                  </Box>
                )}

                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: "transparent",
                    mb: activeTab === 0 ? 2 : 0,
                  }}
                >
                  {/* Header Row */}
                  <Box
                    sx={{
                      display: "flex",
                      backgroundColor: alpha(paColors[pa].main, 0.03),
                      p: 2,
                      borderRadius: "12px 12px 0 0",
                    }}
                  >
                    <Box sx={{ width: "30%", pl: 2 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.875rem",
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
                          fontSize: "0.875rem",
                          color: themeColors.text.secondary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        Previstos
                        <Tooltip title="Quantidade prevista para saída">
                          <InfoOutlined sx={{ ml: 0.5, fontSize: "0.875rem", color: themeColors.text.disabled }} />
                        </Tooltip>
                      </Typography>
                    </Box>
                    <Box sx={{ width: "20%", textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: themeColors.text.secondary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        Realizados
                        <Tooltip title="Quantidade que efetivamente saiu">
                          <InfoOutlined sx={{ ml: 0.5, fontSize: "0.875rem", color: themeColors.text.disabled }} />
                        </Tooltip>
                      </Typography>
                    </Box>
                    <Box sx={{ width: "30%", textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: themeColors.text.secondary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        Progresso
                        <Tooltip title="Percentual de realização">
                          <InfoOutlined sx={{ ml: 0.5, fontSize: "0.875rem", color: themeColors.text.disabled }} />
                        </Tooltip>
                      </Typography>
                    </Box>
                  </Box>

                  {/* Resource Rows */}
                  {resourceTypes.map((resource, index) => {
                    const resourceData = data[pa][resource.key]
                    const stats = calculateStats(resourceData.expected, resourceData.actual)
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
                          p: 2.5,
                          backgroundColor: index % 2 === 0 ? "transparent" : alpha(themeColors.text.primary, 0.01),
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: alpha(paColors[pa].main, 0.05),
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        {/* Resource Name */}
                        <Box sx={{ width: "30%", display: "flex", alignItems: "center", pl: 2 }}>
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: "12px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: alpha(paColors[pa].main, 0.08),
                              color: paColors[pa].main,
                              mr: 2,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: `0 4px 12px ${alpha(paColors[pa].main, 0.2)}`,
                              },
                            }}
                          >
                            {resource.icon}
                          </Box>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "1rem",
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
                              fontWeight: 700,
                              fontSize: "1.5rem",
                              color: themeColors.text.primary,
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {resourceData.expected}
                          </Typography>
                        </Box>

                        {/* Actual */}
                        <Box sx={{ width: "20%", textAlign: "center" }}>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: "1.5rem",
                              color: paColors[pa].main,
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {resourceData.actual}
                          </Typography>
                        </Box>

                        {/* Progress */}
                        <Box sx={{ width: "30%", px: 2 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                color: progressColor,
                              }}
                            >
                              {stats.percentage}%
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                color: stats.isPositive ? themeColors.success.main : themeColors.error.main,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {stats.isPositive ? (
                                <TrendingUp sx={{ fontSize: "1rem", mr: 0.5 }} />
                              ) : (
                                <TrendingDown sx={{ fontSize: "1rem", mr: 0.5 }} />
                              )}
                              {stats.isPositive ? "+" : ""}
                              {stats.difference}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: alpha(progressColor, 0.15),
                              position: "relative",
                              overflow: "hidden",
                              boxShadow: `inset 0 1px 2px ${alpha("#000", 0.05)}`,
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                height: "100%",
                                width: `${Math.min(stats.percentage, 100)}%`,
                                background: `linear-gradient(90deg, ${alpha(progressColor, 0.8)}, ${progressColor})`,
                                borderRadius: 4,
                                transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                                boxShadow: `0 1px 2px ${alpha(progressColor, 0.4)}`,
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )
                  })}
                </Paper>
              </Box>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default ResourceComparisonStats

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
  Tooltip,
  Tabs,
  Tab,
  Divider,
} from "@mui/material"
import {
  Refresh,
  DirectionsCar,
  Person,
  Group,
  CheckCircle,
  Schedule,
  TrendingUp,
  LocationOn,
} from "@mui/icons-material"

const ResourceComparisonStats = ({ themeColors, keyframes, onRefresh, dashboardData }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState(0)

  // Process dashboard data when it changes
  useEffect(() => {
    if (dashboardData && dashboardData.seletiva_por_pa) {
      setLoading(false)
      setError(null)
    } else if (dashboardData === null) {
      setLoading(true)
    } else {
      setError("Dados não disponíveis")
      setLoading(false)
    }
  }, [dashboardData])

  const handleRefresh = () => {
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
  const calculateStats = (actual) => {
    let totalResources = 0
    let completedResources = 0

    for (const resourceType of resourceTypes) {
      if (dashboardData?.seletiva_por_pa) {
        const paData = dashboardData.seletiva_por_pa
        for (const pa in paData) {
          totalResources += 1
          if (paData[pa] && paData[pa][resourceType.key] > 0) {
            completedResources += 1
          }
        }
      }
    }

    const percentage = totalResources > 0 ? Math.round((completedResources / totalResources) * 100) : 0
    return {
      percentage: percentage,
      actual: actual,
    }
  }

  // PA colors - more subtle
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

  // Get PA names as an array from dashboard data
  const paNames = dashboardData?.seletiva_por_pa ? Object.keys(dashboardData.seletiva_por_pa) : []

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
        borderRadius: "12px",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05)",
        mb: 4,
        background: themeColors.background.card,
        position: "relative",
        border: "none",
        overflow: "hidden",
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Box
              sx={{
                width: { xs: "28px", sm: "32px" },
                height: { xs: "28px", sm: "32px" },
                borderRadius: "8px",
                background: themeColors.secondary.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircle
                sx={{
                  color: "white",
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  color: themeColors.text.primary,
                }}
              >
                Comparativo de Recursos por PA
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  color: themeColors.text.secondary,
                  fontWeight: 400,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Previstos vs. Realizados
                {!loading && (
                  <Box component="span" sx={{ ml: 1, display: "inline-flex", alignItems: "center" }}>
                    <Schedule sx={{ fontSize: "0.75rem", mr: 0.5, color: themeColors.text.secondary }} />
                    {formatDate(new Date().toISOString())}
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
          padding: "1rem 1.25rem",
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

      <Divider sx={{ opacity: 0.6 }} />

      <CardContent sx={{ padding: "1.25rem", pt: "1rem" }}>
        {loading ? (
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
                        Realizados
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
                    // Get actual value from dashboard data
                    const actualValue = dashboardData?.seletiva_por_pa?.[pa]?.[resource.key] || 0
                    const stats = calculateStats(actualValue)
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
                            {dashboardData?.seletiva_por_pa?.[pa]?.[resource.key + "_esperado"] || 0}
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
                                color: themeColors.success.main,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <TrendingUp sx={{ fontSize: "0.875rem", mr: 0.25 }} />
                              {actualValue}
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

export default ResourceComparisonStats

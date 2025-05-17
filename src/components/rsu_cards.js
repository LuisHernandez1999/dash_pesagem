"use client"

import { useState, useEffect } from "react"
import { Box, Typography, alpha, Card, CardContent } from "@mui/material"
import { DirectionsCar, CheckCircle, Cancel, LocalShipping } from "@mui/icons-material"

// Custom stat card component
const CustomStatCard = ({ title, value, icon: Icon, color, highlight, keyframes }) => (
  <Card
    sx={{
      position: "relative",
      overflow: "hidden",
      borderRadius: "16px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      background: "white",
      height: "100%",
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "3px",
        background: color,
        zIndex: 1,
      },
      animation: highlight
        ? `${keyframes?.fadeIn || "fadeIn"} 0.6s ease-out`
        : `${keyframes?.fadeIn || "fadeIn"} 0.6s ease-out`,
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: "20px",
        right: "20px",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: alpha(color, 0.1),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon sx={{ fontSize: 24, color: color }} />
    </Box>
    <CardContent sx={{ p: 3, pt: 4, pb: 5 }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "2rem", sm: "2.5rem" },
          color: "#1e293b",
          mb: 1,
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "#64748b",
          fontWeight: 500,
          fontSize: "0.95rem",
        }}
      >
        {title}
      </Typography>
    </CardContent>
  </Card>
)

// Stats Cards Grid Component
const StatsCards = ({ themeColors, keyframes }) => {
  // State variables
  const [statsData, setStatsData] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    inactiveVehicles: 0,
    vehiclesReleasedToday: 0,
  })
  const [loading, setLoading] = useState(true)
  const [highlightedStat, setHighlightedStat] = useState(null)

  // Auto-refresh state
  const [autoRefreshTotal, setAutoRefreshTotal] = useState(true)
  const [autoRefreshActive, setAutoRefreshActive] = useState(true)
  const [autoRefreshInactive, setAutoRefreshInactive] = useState(true)
  const [autoRefreshReleased, setAutoRefreshReleased] = useState(true)

  // Função para carregar os dados iniciais
  const loadStatsData = async () => {
    setLoading(true)
    try {
      // Simulação de chamada à API
      // Em uma aplicação real, isso seria uma chamada à API
      setTimeout(() => {
        setStatsData({
          totalVehicles: 120,
          activeVehicles: 85,
          inactiveVehicles: 35,
          vehiclesReleasedToday: 42,
        })
        setLoading(false)
      }, 800)
    } catch (error) {
      console.error("Erro ao carregar dados de estatísticas:", error)
      setLoading(false)
    }
  }

  // Individual refresh functions for each stat
  const refreshTotalVehicles = async () => {
    try {
      setStatsData((prev) => ({ ...prev, totalVehicles: null }))
      // Simulate API call
      setTimeout(() => {
        setStatsData((prev) => ({
          ...prev,
          totalVehicles: 120 + Math.floor(Math.random() * 5),
        }))
        setHighlightedStat("totalVehicles")
      }, 500)
    } catch (error) {
      console.error("Erro ao atualizar total de veículos:", error)
    }
  }

  const refreshActiveVehicles = async () => {
    try {
      setStatsData((prev) => ({ ...prev, activeVehicles: null }))
      // Simulate API call
      setTimeout(() => {
        setStatsData((prev) => ({
          ...prev,
          activeVehicles: 85 + Math.floor(Math.random() * 3),
        }))
        setHighlightedStat("activeVehicles")
      }, 500)
    } catch (error) {
      console.error("Erro ao atualizar veículos ativos:", error)
    }
  }

  const refreshInactiveVehicles = async () => {
    try {
      setStatsData((prev) => ({ ...prev, inactiveVehicles: null }))
      // Simulate API call
      setTimeout(() => {
        setStatsData((prev) => ({
          ...prev,
          inactiveVehicles: 35 - Math.floor(Math.random() * 2),
        }))
        setHighlightedStat("inactiveVehicles")
      }, 500)
    } catch (error) {
      console.error("Erro ao atualizar veículos inativos:", error)
    }
  }

  const refreshVehiclesReleasedToday = async () => {
    try {
      setStatsData((prev) => ({ ...prev, vehiclesReleasedToday: null }))
      // Simulate API call
      setTimeout(() => {
        setStatsData((prev) => ({
          ...prev,
          vehiclesReleasedToday: 42 + Math.floor(Math.random() * 3),
        }))
        setHighlightedStat("vehiclesReleasedToday")
      }, 500)
    } catch (error) {
      console.error("Erro ao atualizar veículos soltos hoje:", error)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadStatsData()
  }, [])

  // Auto-refresh effects
  useEffect(() => {
    if (autoRefreshReleased) {
      const interval = setInterval(() => {
        refreshVehiclesReleasedToday()
      }, 240000) // Atualiza a cada 4 minutos
      return () => clearInterval(interval)
    }
  }, [autoRefreshReleased])

  useEffect(() => {
    if (autoRefreshTotal) {
      const interval = setInterval(() => {
        refreshTotalVehicles()
      }, 240000) // Refresh every 4 minutes
      return () => clearInterval(interval)
    }
  }, [autoRefreshTotal])

  useEffect(() => {
    if (autoRefreshActive) {
      const interval = setInterval(() => {
        refreshActiveVehicles()
      }, 240000) // Refresh every 4 minutes
      return () => clearInterval(interval)
    }
  }, [autoRefreshActive])

  useEffect(() => {
    if (autoRefreshInactive) {
      const interval = setInterval(() => {
        refreshInactiveVehicles()
      }, 240000) // Refresh every 4 minutes
      return () => clearInterval(interval)
    }
  }, [autoRefreshInactive])

  // Clear highlight after 1 second
  useEffect(() => {
    if (highlightedStat) {
      setTimeout(() => {
        setHighlightedStat(null)
      }, 1000)
    }
  }, [highlightedStat])

  return (
    <Box component="section">
      <Box
        sx={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          mb: 3,
        }}
      >
        <Box>
          <CustomStatCard
            title="Quantidade veículos RSU"
            value={statsData.totalVehicles === null ? "..." : statsData.totalVehicles}
            icon={DirectionsCar}
            color={themeColors?.primary?.main || "#3a86ff"}
            highlight={highlightedStat === "totalVehicles"}
            keyframes={keyframes}
          />
        </Box>
        <Box>
          <CustomStatCard
            title="Quantidade de ativos"
            value={statsData.activeVehicles === null ? "..." : statsData.activeVehicles}
            icon={CheckCircle}
            color={themeColors?.success?.main || "#00c896"}
            highlight={highlightedStat === "activeVehicles"}
            keyframes={keyframes}
          />
        </Box>
        <Box>
          <CustomStatCard
            title="Quantidade inativos"
            value={statsData.inactiveVehicles === null ? "..." : statsData.inactiveVehicles}
            icon={Cancel}
            color={themeColors?.error?.main || "#fb5607"}
            highlight={highlightedStat === "inactiveVehicles"}
            keyframes={keyframes}
          />
        </Box>
        <Box>
          <CustomStatCard
            title="Quantidade RSU soltos hoje"
            value={statsData.vehiclesReleasedToday === null ? "..." : statsData.vehiclesReleasedToday}
            icon={LocalShipping}
            color={themeColors?.warning?.main || "#ffbe0b"}
            highlight={highlightedStat === "vehiclesReleasedToday"}
            keyframes={keyframes}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default StatsCards

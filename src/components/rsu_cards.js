"use client"

import { useState, useEffect } from "react"
import { Box, Typography, alpha, Card, CardContent } from "@mui/material"
import { DirectionsCar, CheckCircle, Cancel, LocalShipping } from "@mui/icons-material"
import { getCountRsuInativos, getCountRsuAtivos, getContagemTotalRsu } from "../service/rsu"

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
const StatsCards = ({ themeColors, keyframes, apiData }) => {
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
      // Fetch data from APIs in parallel
      const [ativosData, inativosData, totalData] = await Promise.all([
        getCountRsuAtivos(),
        getCountRsuInativos(),
        getContagemTotalRsu(),
      ])

      // Log the API responses to debug
      console.log("API Responses:", { ativosData, inativosData, totalData })

      // Extract counts from API responses with multiple fallback options
      const ativos = ativosData?.count_rsu_ativos || ativosData?.count || ativosData?.total || 0
      const inativos =
        inativosData?.count_seletiva_inativos ||
        inativosData?.count_rsu_inativos ||
        inativosData?.count ||
        inativosData?.total ||
        0
      const total = totalData?.count_total_rsu || totalData?.total_rsu || totalData?.count || totalData?.total || 0

      console.log("Extracted values:", { ativos, inativos, total })

      // Update state with API data
      setStatsData({
        totalVehicles: total,
        activeVehicles: ativos,
        inactiveVehicles: inativos,
        vehiclesReleasedToday: statsData.vehiclesReleasedToday || 0,
      })
      setLoading(false)
    } catch (error) {
      console.error("Erro ao carregar dados de estatísticas:", error)
      setLoading(false)
    }
  }

  // Individual refresh functions for each stat
  const refreshTotalVehicles = async () => {
    try {
      setStatsData((prev) => ({ ...prev, totalVehicles: null }))
      const totalData = await getContagemTotalRsu()
      console.log("Total data response:", totalData)
      const total = totalData?.count_total_rsu || totalData?.total_rsu || totalData?.count || totalData?.total || 0
      console.log("Extracted total:", total)
      setStatsData((prev) => ({
        ...prev,
        totalVehicles: total,
      }))
      setHighlightedStat("totalVehicles")
    } catch (error) {
      console.error("Erro ao atualizar total de veículos:", error)
    }
  }

  const refreshActiveVehicles = async () => {
    try {
      setStatsData((prev) => ({ ...prev, activeVehicles: null }))
      const ativosData = await getCountRsuAtivos()
      const ativos = ativosData.count_rsu_ativos || ativosData.count || 0
      setStatsData((prev) => ({
        ...prev,
        activeVehicles: ativos,
      }))
      setHighlightedStat("activeVehicles")
    } catch (error) {
      console.error("Erro ao atualizar veículos ativos:", error)
    }
  }

  const refreshInactiveVehicles = async () => {
    try {
      setStatsData((prev) => ({ ...prev, inactiveVehicles: null }))
      const inativosData = await getCountRsuInativos()
      const inativos = inativosData.count_seletiva_inativos || inativosData.count || 0
      setStatsData((prev) => ({
        ...prev,
        inactiveVehicles: inativos,
      }))
      setHighlightedStat("inactiveVehicles")
    } catch (error) {
      console.error("Erro ao atualizar veículos inativos:", error)
    }
  }

  const refreshVehiclesReleasedToday = async () => {
    // This will be updated when parent component refreshes apiData
    setHighlightedStat("vehiclesReleasedToday")
  }

  // Load data on component mount
  useEffect(() => {
    loadStatsData()
  }, [])

  // Update vehiclesReleasedToday when apiData changes
  useEffect(() => {
    if (apiData?.totalRSUHoje !== undefined) {
      setStatsData((prev) => ({
        ...prev,
        vehiclesReleasedToday: apiData.totalRSUHoje,
      }))
    }
  }, [apiData])

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

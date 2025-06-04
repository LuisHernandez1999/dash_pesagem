"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  IconButton,
  alpha,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Timeline,
  Refresh,
  TrendingUp,
  ShowChart,
  AccessTime,
  BarChart as BarChartIcon,
  FilterList,
  CalendarToday,
  Construction,
} from "@mui/icons-material"

const EQUIPMENT_COLORS = {
  carroceria: {
    main: "#3B82F6",
    light: "#60A5FA",
    dark: "#1D4ED8",
  },
  paCarregadeira: {
    main: "#8B5CF6",
    light: "#A78BFA",
    dark: "#7C3AED",
  },
  retroescavadeira: {
    main: "#06B6D4",
    light: "#22D3EE",
    dark: "#0891B2",
  },
}

const EQUIPMENT_OPTIONS = [
  { value: "carroceria", label: "Carroceria" },
  { value: "paCarregadeira", label: "Pá Carregadeira" },
  { value: "retroescavadeira", label: "Retroescavadeira" },
]

const DATE_RANGE_OPTIONS = [
  { value: "all", label: "Toda Semana" },
  { value: "weekdays", label: "Dias Úteis" },
  { value: "weekend", label: "Final de Semana" },
  { value: "first-half", label: "Primeira Metade" },
  { value: "second-half", label: "Segunda Metade" },
]

const EQUIPMENT_KEYS = Object.keys(EQUIPMENT_COLORS)
const WEEKEND_DAYS = new Set(["Sábado", "Domingo"])

const WeeklyDistributionChart = ({ weeklyData, themeColors, onRefresh, loading = false }) => {
  const [chartType, setChartType] = useState("bar")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [selectedEquipments, setSelectedEquipments] = useState(EQUIPMENT_KEYS)
  const [selectedDateRange, setSelectedDateRange] = useState("all")

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType)
    }
  }

  const handleRefresh = () => {
    setLastUpdated(new Date())
    if (onRefresh) {
      onRefresh()
    }
  }

  const handleEquipmentChange = (event) => {
    const value = event.target.value
    setSelectedEquipments(typeof value === "string" ? value.split(",") : value)
  }

  const handleDateRangeChange = (event) => {
    setSelectedDateRange(event.target.value)
  }

  const filterDataByDateRange = (data, dateRange) => {
    if (!data || data.length === 0) return []

    switch (dateRange) {
      case "weekdays":
        return data.filter((day) => !WEEKEND_DAYS.has(day.day))
      case "weekend":
        return data.filter((day) => WEEKEND_DAYS.has(day.day))
      case "first-half":
        return data.slice(0, Math.ceil(data.length / 2))
      case "second-half":
        return data.slice(Math.ceil(data.length / 2))
      default:
        return data
    }
  }

  const filteredData = useMemo(() => {
    if (!weeklyData || weeklyData.length === 0) return []

    const dateFiltered = filterDataByDateRange(weeklyData, selectedDateRange)

    if (selectedEquipments.length === EQUIPMENT_KEYS.length) {
      return dateFiltered
    }

    const selectedSet = new Set(selectedEquipments)

    return dateFiltered.map((day) => {
      const newDay = { day: day.day }
      EQUIPMENT_KEYS.forEach((equipment) => {
        newDay[equipment] = selectedSet.has(equipment) ? day[equipment] : 0
      })
      return newDay
    })
  }, [weeklyData, selectedEquipments, selectedDateRange])

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => {
        acc.carroceria += day.carroceria || 0
        acc.paCarregadeira += day.paCarregadeira || 0
        acc.retroescavadeira += day.retroescavadeira || 0
        return acc
      },
      { carroceria: 0, paCarregadeira: 0, retroescavadeira: 0 },
    )
  }, [filteredData])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0)

      return (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "none",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.12)",
            minWidth: "240px",
            backdropFilter: "blur(20px)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              color: "#1F2937",
              mb: 1.5,
              fontSize: "1.1rem",
              textAlign: "center",
            }}
          >
            {label}
          </Typography>

          <Box sx={{ mb: 2, textAlign: "center" }}>
            <Chip
              label={`${total} equipamentos`}
              size="small"
              sx={{
                backgroundColor: alpha("#3B82F6", 0.1),
                color: "#3B82F6",
                fontWeight: 600,
              }}
            />
          </Box>

          {payload.map((entry, index) => {
            const equipmentType = entry.dataKey
            const colors = EQUIPMENT_COLORS[equipmentType]

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                  p: 1.5,
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, ${alpha(colors.main, 0.05)}, ${alpha(colors.light, 0.03)})`,
                  border: `1px solid ${alpha(colors.main, 0.1)}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: colors.main,
                    }}
                  />
                  <Typography
                    sx={{
                      color: "#374151",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    {entry.name}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: colors.main,
                    fontWeight: 700,
                    fontSize: "0.875rem",
                  }}
                >
                  {entry.value}
                </Typography>
              </Box>
            )
          })}
        </Box>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }) => {
    if (!payload) return null

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 3,
          flexWrap: "wrap",
        }}
      >
        {payload.map((entry, index) => {
          const equipmentType = entry.dataKey
          const colors = EQUIPMENT_COLORS[equipmentType]

          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 2,
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${alpha(colors.main, 0.08)}, ${alpha(colors.light, 0.04)})`,
                border: `1px solid ${alpha(colors.main, 0.15)}`,
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  background: `linear-gradient(135deg, ${alpha(colors.main, 0.15)}, ${alpha(colors.light, 0.08)})`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: colors.main,
                }}
              />
              <Typography
                sx={{
                  color: "#374151",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                {entry.value}
              </Typography>
              <Typography
                sx={{
                  color: colors.main,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  minWidth: "20px",
                  textAlign: "center",
                }}
              >
                {totals[entry.dataKey]}
              </Typography>
            </Box>
          )
        })}
      </Box>
    )
  }

  if (loading || !mounted || !weeklyData || weeklyData.length === 0) {
    return (
      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
          mb: 4,
          border: "1px solid rgba(0, 0, 0, 0.05)",
          background: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <CardContent sx={{ padding: "2rem", textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: "1rem",
              color: "#6B7280",
              fontWeight: 500,
            }}
          >
            {loading ? "Carregando dados..." : !mounted ? "Inicializando..." : "Nenhum dado disponível"}
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      sx={{
        borderRadius: "20px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s ease",
        overflow: "hidden",
        "&:hover": {
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-2px)",
        },
        background: "rgba(255, 255, 255, 0.95)",
        mb: 4,
        border: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${alpha("#3B82F6", 0.1)}, ${alpha("#8B5CF6", 0.05)})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${alpha("#3B82F6", 0.15)}`,
              }}
            >
              {chartType === "bar" ? (
                <Timeline sx={{ color: "#3B82F6", fontSize: "1.5rem" }} />
              ) : (
                <ShowChart sx={{ color: "#3B82F6", fontSize: "1.5rem" }} />
              )}
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  color: "#111827",
                  mb: 0.5,
                }}
              >
                Distribuição Semanal
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TrendingUp sx={{ fontSize: "0.9rem", color: "#10B981" }} />
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: "#6B7280",
                    fontWeight: 500,
                  }}
                >
                  Análise de utilização por tipo de equipamento
                </Typography>
              </Box>
            </Box>
          </Box>
        }
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={handleChartTypeChange}
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  borderRadius: "10px",
                  color: "#6B7280",
                  minWidth: "36px",
                  height: "36px",
                  "&.Mui-selected": {
                    background: `linear-gradient(135deg, #3B82F6, #8B5CF6)`,
                    color: "white",
                    border: "1px solid transparent",
                  },
                },
              }}
            >
              <ToggleButton value="bar">
                <Tooltip title="Gráfico de Barras" arrow>
                  <BarChartIcon sx={{ fontSize: "1.1rem" }} />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="line">
                <Tooltip title="Gráfico de Linhas" arrow>
                  <ShowChart sx={{ fontSize: "1.1rem" }} />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
            <IconButton
              sx={{
                color: "#6B7280",
                background: alpha("#3B82F6", 0.06),
                borderRadius: "10px",
                width: "36px",
                height: "36px",
                "&:hover": {
                  color: "white",
                  background: `linear-gradient(135deg, #3B82F6, #8B5CF6)`,
                  transform: "rotate(180deg)",
                },
              }}
              onClick={handleRefresh}
            >
              <Refresh sx={{ fontSize: "1.1rem" }} />
            </IconButton>
          </Box>
        }
        sx={{
          padding: "1.5rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      />

      {/* Filtros */}
      <Box
        sx={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          background: `linear-gradient(135deg, rgba(59, 130, 246, 0.02), rgba(139, 92, 246, 0.01))`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <FilterList sx={{ color: "#3B82F6", fontSize: "1.1rem" }} />
          <Typography sx={{ fontWeight: 600, fontSize: "1rem", color: "#374151" }}>Filtros</Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          {/* Filtro de Equipamentos */}
          <FormControl size="small">
            <InputLabel>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Construction sx={{ fontSize: "1rem" }} />
                Equipamentos
              </Box>
            </InputLabel>
            <Select
              multiple
              value={selectedEquipments}
              onChange={handleEquipmentChange}
              input={<OutlinedInput label="Equipamentos" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => {
                    const option = EQUIPMENT_OPTIONS.find((opt) => opt.value === value)
                    const colors = EQUIPMENT_COLORS[value]
                    return (
                      <Chip
                        key={value}
                        label={option?.label}
                        size="small"
                        sx={{
                          backgroundColor: alpha(colors.main, 0.1),
                          color: colors.main,
                          fontWeight: 600,
                        }}
                      />
                    )
                  })}
                </Box>
              )}
            >
              {EQUIPMENT_OPTIONS.map((option) => {
                const colors = EQUIPMENT_COLORS[option.value]
                return (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox
                      checked={selectedEquipments.indexOf(option.value) > -1}
                      size="small"
                      sx={{ color: colors.main }}
                    />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          {/* Filtro de Período */}
          <FormControl size="small">
            <InputLabel>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarToday sx={{ fontSize: "1rem" }} />
                Período
              </Box>
            </InputLabel>
            <Select value={selectedDateRange} onChange={handleDateRangeChange} label="Período">
              {DATE_RANGE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <CardContent sx={{ padding: "1.5rem" }}>
        <Box
          sx={{
            width: "100%",
            height: "450px",
            borderRadius: "16px",
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))`,
            padding: "1rem",
            border: "1px solid rgba(0, 0, 0, 0.03)",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={filteredData} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
                <defs>
                  {EQUIPMENT_KEYS.map((key) => {
                    const colors = EQUIPMENT_COLORS[key]
                    return (
                      <linearGradient key={key} id={key} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.light} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={colors.main} stopOpacity={0.1} />
                      </linearGradient>
                    )
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(0, 0, 0, 0.1)" }}
                />
                <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
                {EQUIPMENT_KEYS.map((key) => {
                  const colors = EQUIPMENT_COLORS[key]
                  const name =
                    key === "carroceria"
                      ? "Carroceria"
                      : key === "paCarregadeira"
                        ? "Pá Carregadeira"
                        : "Retroescavadeira"
                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={name}
                      stroke={colors.main}
                      strokeWidth={3}
                      dot={{ fill: colors.main, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: colors.main, strokeWidth: 2 }}
                    />
                  )
                })}
              </LineChart>
            ) : (
              <BarChart data={filteredData} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
                <defs>
                  {EQUIPMENT_KEYS.map((key) => {
                    const colors = EQUIPMENT_COLORS[key]
                    return (
                      <linearGradient key={key} id={key} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors.light} />
                        <stop offset="100%" stopColor={colors.main} />
                      </linearGradient>
                    )
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(0, 0, 0, 0.1)" }}
                />
                <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
                {EQUIPMENT_KEYS.map((key) => {
                  const name =
                    key === "carroceria"
                      ? "Carroceria"
                      : key === "paCarregadeira"
                        ? "Pá Carregadeira"
                        : "Retroescavadeira"
                  return <Bar key={key} dataKey={key} name={name} fill={`url(#${key})`} radius={[4, 4, 0, 0]} />
                })}
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mt: 2,
            pt: 1.5,
            borderTop: "1px solid rgba(0, 0, 0, 0.05)",
            borderRadius: "12px",
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))`,
            padding: "0.75rem",
          }}
        >
          <AccessTime sx={{ fontSize: "1rem", color: "#6B7280" }} />
          <Typography sx={{ fontSize: "0.8rem", color: "#6B7280", fontWeight: 500 }}>
            Última atualização:{" "}
            <span style={{ color: "#3B82F6", fontWeight: 600 }}>
              {lastUpdated.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default WeeklyDistributionChart

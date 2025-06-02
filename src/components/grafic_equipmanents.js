"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
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

// Constantes memoizadas para evitar recriações
const EQUIPMENT_COLORS = {
  carroceria: {
    main: "#3B82F6",
    light: "#60A5FA",
    dark: "#1D4ED8",
    gradient: ["#3B82F6", "#60A5FA"],
  },
  paCarregadeira: {
    main: "#8B5CF6",
    light: "#A78BFA",
    dark: "#7C3AED",
    gradient: ["#8B5CF6", "#A78BFA"],
  },
  retroescavadeira: {
    main: "#06B6D4",
    light: "#22D3EE",
    dark: "#0891B2",
    gradient: ["#06B6D4", "#22D3EE"],
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

// Componente de filtro memoizado para evitar re-renders
const EquipmentFilter = React.memo(({ selectedEquipments, onEquipmentChange }) => {
  const renderValue = useCallback(
    (selected) => (
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
                border: `1px solid ${alpha(colors.main, 0.2)}`,
                fontSize: "0.75rem",
                height: "24px",
              }}
            />
          )
        })}
      </Box>
    ),
    [],
  )

  return (
    <FormControl
      size="small"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(59, 130, 246, 0.1)",
          transition: "all 0.1s ease",
          "&:hover": {
            border: "1px solid rgba(59, 130, 246, 0.2)",
          },
          "&.Mui-focused": {
            border: "1px solid #3B82F6",
            boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#6B7280",
          fontWeight: 500,
          fontSize: "0.875rem",
          "&.Mui-focused": {
            color: "#3B82F6",
          },
        },
      }}
    >
      <InputLabel>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Construction sx={{ fontSize: "1rem" }} />
          Equipamentos
        </Box>
      </InputLabel>
      <Select
        multiple
        value={selectedEquipments}
        onChange={onEquipmentChange}
        input={<OutlinedInput label="Equipamentos" />}
        renderValue={renderValue}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 250,
              borderRadius: "12px",
              "& .MuiMenuItem-root": {
                transition: "all 0.1s ease",
                fontSize: "0.875rem",
              },
            },
          },
        }}
      >
        {EQUIPMENT_OPTIONS.map((option) => {
          const colors = EQUIPMENT_COLORS[option.value]
          return (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                checked={selectedEquipments.indexOf(option.value) > -1}
                size="small"
                sx={{
                  color: colors.main,
                  "&.Mui-checked": {
                    color: colors.main,
                  },
                }}
              />
              <ListItemText
                primary={<Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>{option.label}</Typography>}
              />
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
})

const DateRangeFilter = React.memo(({ selectedDateRange, onDateRangeChange }) => (
  <FormControl
    size="small"
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(59, 130, 246, 0.1)",
        transition: "all 0.1s ease",
        "&:hover": {
          border: "1px solid rgba(59, 130, 246, 0.2)",
        },
        "&.Mui-focused": {
          border: "1px solid #3B82F6",
          boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)",
        },
      },
      "& .MuiInputLabel-root": {
        color: "#6B7280",
        fontWeight: 500,
        fontSize: "0.875rem",
        "&.Mui-focused": {
          color: "#3B82F6",
        },
      },
    }}
  >
    <InputLabel>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CalendarToday sx={{ fontSize: "1rem" }} />
        Período
      </Box>
    </InputLabel>
    <Select
      value={selectedDateRange}
      onChange={onDateRangeChange}
      label="Período"
      MenuProps={{
        PaperProps: {
          sx: {
            borderRadius: "12px",
            "& .MuiMenuItem-root": {
              transition: "all 0.1s ease",
              fontSize: "0.875rem",
            },
          },
        },
      }}
    >
      {DATE_RANGE_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>{option.label}</Typography>
        </MenuItem>
      ))}
    </Select>
  </FormControl>
))

const WeeklyDistributionChart = React.memo(({ weeklyData, themeColors, onRefresh, loading = false }) => {
  const [chartType, setChartType] = useState("bar")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  // Estados dos filtros com valores iniciais otimizados
  const [selectedEquipments, setSelectedEquipments] = useState(EQUIPMENT_KEYS)
  const [selectedDateRange, setSelectedDateRange] = useState("all")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Callbacks memoizados para evitar re-renders
  const handleChartTypeChange = useCallback((event, newType) => {
    if (newType !== null) {
      setChartType(newType)
    }
  }, [])

  const handleRefresh = useCallback(() => {
    setLastUpdated(new Date())
    if (onRefresh) {
      onRefresh()
    }
  }, [onRefresh])

  const handleEquipmentChange = useCallback((event) => {
    const value = event.target.value
    setSelectedEquipments(typeof value === "string" ? value.split(",") : value)
  }, [])

  const handleDateRangeChange = useCallback((event) => {
    setSelectedDateRange(event.target.value)
  }, [])

  // Função de filtragem otimizada com memoização
  const filterDataByDateRange = useCallback((data, dateRange) => {
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
  }, [])

  // Dados filtrados com memoização ultra-rápida
  const filteredData = useMemo(() => {
    if (!weeklyData || weeklyData.length === 0) return []

    // Primeiro aplica filtro de data (mais rápido)
    const dateFiltered = filterDataByDateRange(weeklyData, selectedDateRange)

    // Depois aplica filtro de equipamentos (otimizado)
    if (selectedEquipments.length === EQUIPMENT_KEYS.length) {
      // Se todos estão selecionados, retorna sem modificar
      return dateFiltered
    }

    // Cria Set para lookup O(1)
    const selectedSet = new Set(selectedEquipments)

    return dateFiltered.map((day) => {
      const newDay = { day: day.day }
      // Só processa equipamentos selecionados
      EQUIPMENT_KEYS.forEach((equipment) => {
        newDay[equipment] = selectedSet.has(equipment) ? day[equipment] : 0
      })
      return newDay
    })
  }, [weeklyData, selectedEquipments, selectedDateRange, filterDataByDateRange])

  // Totais calculados com memoização
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

  // Componentes memoizados para tooltip e legenda
  const CustomTooltip = useMemo(
    () =>
      ({ active, payload, label }) => {
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
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#1F2937",
                  mb: 1.5,
                  fontSize: "1.1rem",
                  textAlign: "center",
                  letterSpacing: "-0.025em",
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
                    fontSize: "0.75rem",
                    height: "24px",
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
                          background: `linear-gradient(135deg, ${colors.main}, ${colors.light})`,
                          boxShadow: `0 2px 8px ${alpha(colors.main, 0.3)}`,
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
                        background: `linear-gradient(135deg, ${colors.main}, ${colors.light})`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
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
      },
    [],
  )

  const CustomLegend = useMemo(
    () =>
      ({ payload }) => {
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
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    "&:hover": {
                      background: `linear-gradient(135deg, ${alpha(colors.main, 0.15)}, ${alpha(colors.light, 0.08)})`,
                      transform: "translateY(-2px) scale(1.02)",
                      boxShadow: `0 8px 24px ${alpha(colors.main, 0.2)}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${colors.main}, ${colors.light})`,
                      boxShadow: `0 2px 8px ${alpha(colors.main, 0.3)}`,
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
                      background: `linear-gradient(135deg, ${colors.main}, ${colors.light})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
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
      },
    [totals],
  )

  const getCustomDot = useCallback(
    (color) => (props) => {
      const { cx, cy, payload } = props
      const value = payload[props.dataKey]

      if (value === 0) return null

      return (
        <g>
          <circle cx={cx} cy={cy} r={8} fill={`url(#${props.dataKey}RadialGradient)`} opacity={0.3} />
          <circle cx={cx} cy={cy} r={6} fill={`url(#${props.dataKey}RadialGradient)`} stroke="white" strokeWidth={2} />
          <circle cx={cx - 1} cy={cy - 1} r={1.5} fill="white" opacity={0.7} />
        </g>
      )
    },
    [],
  )

  const getCustomActiveDot = useCallback(
    (color) => (props) => {
      const { cx, cy, dataKey } = props

      return (
        <g>
          <circle cx={cx} cy={cy} r={14} fill="none" stroke={color.main} strokeWidth={1} opacity={0.2} />
          <circle cx={cx} cy={cy} r={10} fill="none" stroke={color.main} strokeWidth={1.5} opacity={0.4} />
          <circle cx={cx} cy={cy} r={8} fill={`url(#${dataKey}RadialGradient)`} stroke="white" strokeWidth={2} />
          <circle cx={cx - 1.5} cy={cy - 1.5} r={2} fill="white" opacity={0.8} />
        </g>
      )
    },
    [],
  )

  const CustomBar = useCallback((props) => {
    const { fill, x, y, width, height } = props

    if (height === 0) return null

    return (
      <g>
        <rect x={x + 1} y={y + 1} width={width} height={height} fill="rgba(0, 0, 0, 0.08)" rx={6} ry={6} />
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          rx={6}
          ry={6}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={1}
        />
        <rect
          x={x + 1}
          y={y + 1}
          width={width - 2}
          height={Math.min(height / 4, 15)}
          fill="rgba(255, 255, 255, 0.25)"
          rx={4}
          ry={4}
        />
        <rect x={x + width - 2} y={y + 2} width={1} height={height - 4} fill="rgba(255, 255, 255, 0.3)" rx={0.5} />
      </g>
    )
  }, [])

  if (loading || !mounted || !weeklyData || weeklyData.length === 0) {
    return (
      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
          mb: 4,
          border: "1px solid rgba(0, 0, 0, 0.05)",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
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
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        "&:hover": {
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-2px)",
        },
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
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
                <Timeline
                  sx={{
                    color: "#3B82F6",
                    fontSize: "1.5rem",
                  }}
                />
              ) : (
                <ShowChart
                  sx={{
                    color: "#3B82F6",
                    fontSize: "1.5rem",
                  }}
                />
              )}
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  color: "#111827",
                  letterSpacing: "-0.025em",
                  mb: 0.5,
                }}
              >
                Distribuição Semanal
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TrendingUp
                  sx={{
                    fontSize: "0.9rem",
                    color: "#10B981",
                  }}
                />
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
                  transition: "all 0.1s ease",
                  "&.Mui-selected": {
                    background: `linear-gradient(135deg, #3B82F6, #8B5CF6)`,
                    color: "white",
                    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                    border: "1px solid transparent",
                    "&:hover": {
                      background: `linear-gradient(135deg, #1D4ED8, #7C3AED)`,
                    },
                  },
                  "&:hover": {
                    backgroundColor: alpha("#3B82F6", 0.06),
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
                border: "1px solid rgba(0, 0, 0, 0.06)",
                transition: "all 0.1s ease",
                "&:hover": {
                  color: "white",
                  background: `linear-gradient(135deg, #3B82F6, #8B5CF6)`,
                  transform: "rotate(180deg)",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
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
          "& .MuiCardHeader-action": {
            margin: 0,
          },
        }}
      />

      {/* Seção de Filtros Ultra-Rápidos */}
      <Box
        sx={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          background: `linear-gradient(135deg, rgba(59, 130, 246, 0.02), rgba(139, 92, 246, 0.01))`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <FilterList sx={{ color: "#3B82F6", fontSize: "1.1rem" }} />
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              color: "#374151",
            }}
          >
            Filtros
          </Typography>
          <Chip
            size="small"
            sx={{
              backgroundColor: alpha("#10B981", 0.1),
              color: "#10B981",
              fontWeight: 600,
              fontSize: "0.7rem",
              height: "20px",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <EquipmentFilter selectedEquipments={selectedEquipments} onEquipmentChange={handleEquipmentChange} />
          <DateRangeFilter selectedDateRange={selectedDateRange} onDateRangeChange={handleDateRangeChange} />
        </Box>
      </Box>

      <CardContent sx={{ padding: "1.5rem" }}>
        <Box
          sx={{
            width: "100%",
            height: "450px",
            position: "relative",
            borderRadius: "16px",
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))`,
            padding: "1rem",
            border: "1px solid rgba(0, 0, 0, 0.03)",
            backdropFilter: "blur(10px)",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart
                data={filteredData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >
                <defs>
                  {EQUIPMENT_KEYS.map((key) => {
                    const colors = EQUIPMENT_COLORS[key]
                    return (
                      <radialGradient
                        key={`${key}RadialGradient`}
                        id={`${key}RadialGradient`}
                        cx="50%"
                        cy="50%"
                        r="50%"
                        fx="50%"
                        fy="50%"
                      >
                        <stop offset="0%" stopColor={colors.light} />
                        <stop offset="100%" stopColor={colors.main} />
                      </radialGradient>
                    )
                  })}

                  <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <CartesianGrid strokeDasharray="2 6" stroke="rgba(0, 0, 0, 0.05)" />
                <XAxis
                  dataKey="day"
                  tick={{
                    fill: "#6B7280",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                  axisLine={{
                    stroke: "rgba(0, 0, 0, 0.08)",
                    strokeWidth: 1,
                  }}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  tick={{
                    fill: "#6B7280",
                    fontSize: 10,
                    fontWeight: 500,
                  }}
                  axisLine={false}
                  tickLine={false}
                  dx={-8}
                />
                <RechartsTooltip content={CustomTooltip} />
                <Legend content={CustomLegend} />

                {EQUIPMENT_KEYS.map((key) => {
                  const colors = EQUIPMENT_COLORS[key]
                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={
                        key === "carroceria"
                          ? "Carroceria"
                          : key === "paCarregadeira"
                            ? "Pá Carregadeira"
                            : "Retroescavadeira"
                      }
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={getCustomDot(colors)}
                      activeDot={getCustomActiveDot(colors)}
                      isAnimationActive={true}
                      animationDuration={600}
                      animationEasing="ease-out"
                      connectNulls={false}
                      filter="url(#glow)"
                    />
                  )
                })}
              </LineChart>
            ) : (
              <BarChart
                data={filteredData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
                barCategoryGap="20%"
              >
                <defs>
                  {EQUIPMENT_KEYS.map((key) => {
                    const colors = EQUIPMENT_COLORS[key]
                    return (
                      <linearGradient key={`${key}BarGradient`} id={`${key}BarGradient`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors.light} stopOpacity={1} />
                        <stop offset="30%" stopColor={colors.main} stopOpacity={0.9} />
                        <stop offset="70%" stopColor={colors.main} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={colors.dark} stopOpacity={1} />
                      </linearGradient>
                    )
                  })}

                  <filter id="barShadow" x="-15%" y="-15%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.15" />
                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.08" />
                  </filter>
                </defs>

                <CartesianGrid strokeDasharray="2 6" stroke="rgba(0, 0, 0, 0.05)" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{
                    fill: "#6B7280",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                  axisLine={{
                    stroke: "rgba(0, 0, 0, 0.08)",
                    strokeWidth: 1,
                  }}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  tick={{
                    fill: "#6B7280",
                    fontSize: 10,
                    fontWeight: 500,
                  }}
                  axisLine={false}
                  tickLine={false}
                  dx={-8}
                />
                <RechartsTooltip content={CustomTooltip} cursor={{ fill: "rgba(0, 0, 0, 0.02)" }} />
                <Legend content={CustomLegend} />

                {EQUIPMENT_KEYS.map((key) => {
                  const colors = EQUIPMENT_COLORS[key]
                  return (
                    <Bar
                      key={key}
                      dataKey={key}
                      name={
                        key === "carroceria"
                          ? "Carroceria"
                          : key === "paCarregadeira"
                            ? "Pá Carregadeira"
                            : "Retroescavadeira"
                      }
                      fill={`url(#${key}BarGradient)`}
                      radius={[8, 8, 0, 0]}
                      maxBarSize={60}
                      filter="url(#barShadow)"
                      isAnimationActive={true}
                      animationDuration={500}
                      animationEasing="ease-out"
                      shape={CustomBar}
                    />
                  )
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
          <AccessTime
            sx={{
              fontSize: "1rem",
              color: "#6B7280",
            }}
          />
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "#6B7280",
              fontWeight: 500,
            }}
          >
            Última atualização:{" "}
            <span style={{ color: "#3B82F6", fontWeight: 600 }}>
              {lastUpdated.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
})

export default WeeklyDistributionChart

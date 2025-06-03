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
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material"
import {
  BarChart as BarChartIcon,
  Refresh,
  TrendingUp,
  AccessTime,
  Garage,
  Build,
  DirectionsCar,
  CompareArrows,
} from "@mui/icons-material"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

const VehicleLocationChart = ({ vehicleData, loading = false, onRefresh, themeColors }) => {
  const [chartView, setChartView] = useState("grouped") // "grouped" or "stacked"
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [animationActive, setAnimationActive] = useState(true)

  useEffect(() => {
    setMounted(true)
    // Desativar animação após o carregamento inicial para melhorar performance
    const timer = setTimeout(() => {
      setAnimationActive(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Cores para os diferentes tipos de localização
  const locationColors = {
    garagem: {
      main: "#3B82F6", // Azul
      light: "#60A5FA",
      dark: "#2563EB",
      gradient: ["#3B82F6", "#60A5FA"],
    },
    manutencao: {
      main: "#F59E0B", // Âmbar
      light: "#FBBF24",
      dark: "#D97706",
      gradient: ["#F59E0B", "#FBBF24"],
    },
  }

  // Dados processados para o gráfico
  const chartData = useMemo(() => {
    // Se não temos dados reais, usamos dados de exemplo
    if (!vehicleData || !vehicleData.todos || vehicleData.todos.length === 0) {
      return [
        {
          tipo: "Caminhão Carroceria",
          garagem: 12,
          manutencao: 3,
          total: 15,
        },
        {
          tipo: "Retroescavadeira",
          garagem: 8,
          manutencao: 2,
          total: 10,
        },
        {
          tipo: "Pá Carregadeira",
          garagem: 6,
          manutencao: 1,
          total: 7,
        },
      ]
    }

    // Processamento dos dados reais
    const equipmentTypes = {}

    // Normalizar nomes para comparação
    const normalizeType = (type) => {
      return type
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-z0-9]/g, "") // Remove caracteres especiais
    }

    // Agrupar por tipo de equipamento
    vehicleData.todos.forEach((equipment) => {
      const normalizedType = normalizeType(equipment.implemento || "")
      let type = ""

      if (normalizedType.includes("carroceria") || normalizedType.includes("caminhao")) {
        type = "Caminhão Carroceria"
      } else if (normalizedType.includes("retroescavadeira") || normalizedType.includes("retro")) {
        type = "Retroescavadeira"
      } else if (normalizedType.includes("pacarregadeira") || normalizedType.includes("carregadeira")) {
        type = "Pá Carregadeira"
      } else {
        type = "Outros"
      }

      if (!equipmentTypes[type]) {
        equipmentTypes[type] = {
          garagem: 0,
          manutencao: 0,
          total: 0,
        }
      }

      const status = normalizeType(equipment.status || "")
      
      if (status.includes("manutencao")) {
        equipmentTypes[type].manutencao++
      } else {
        // Consideramos que se não está em manutenção, está na garagem
        equipmentTypes[type].garagem++
      }
      
      equipmentTypes[type].total++
    })

    // Converter para o formato do gráfico
    return Object.entries(equipmentTypes).map(([tipo, stats]) => ({
      tipo,
      garagem: stats.garagem,
      manutencao: stats.manutencao,
      total: stats.total,
    }))
  }, [vehicleData])

  // Totais calculados
  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, item) => {
        acc.garagem += item.garagem
        acc.manutencao += item.manutencao
        acc.total += item.total
        return acc
      },
      { garagem: 0, manutencao: 0, total: 0 }
    )
  }, [chartData])

  // Handlers
  const handleChartViewChange = useCallback((event, newView) => {
    if (newView !== null) {
      setChartView(newView)
    }
  }, [])

  const handleRefresh = useCallback(() => {
    setLastUpdated(new Date())
    setAnimationActive(true)
    
    // Desativar animação após refresh para melhorar performance
    const timer = setTimeout(() => {
      setAnimationActive(false)
    }, 1000)
    
    if (onRefresh) {
      onRefresh()
    }
    
    return () => clearTimeout(timer)
  }, [onRefresh])

  // Tooltip personalizado
  const CustomTooltip = useCallback(
    ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "16px",
              padding: "16px",
              boxShadow: "0 16px 48px rgba(0, 0, 0, 0.12)",
              minWidth: "220px",
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
                label={`${payload.reduce((sum, entry) => sum + entry.value, 0)} veículos`}
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
              const locationKey = entry.dataKey
              const colors = locationColors[locationKey] || { main: "#6B7280", light: "#9CA3AF" }

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
                      {locationKey === "garagem" ? "Garagem" : "Manutenção"}
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
    []
  )

  // Legenda personalizada
  const CustomLegend = useCallback(
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
            const locationKey = entry.dataKey
            const colors = locationColors[locationKey] || { main: "#6B7280", light: "#9CA3AF" }
            const total = totals[locationKey]

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
                {locationKey === "garagem" ? (
                  <Garage sx={{ color: colors.main, fontSize: "1.2rem" }} />
                ) : (
                  <Build sx={{ color: colors.main, fontSize: "1.2rem" }} />
                )}
                <Box>
                  <Typography
                    sx={{
                      color: "#374151",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    {locationKey === "garagem" ? "Garagem" : "Manutenção"}
                  </Typography>
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
                    {total} veículos
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      )
    },
    [totals]
  )

  // Barra personalizada com gradiente e efeitos
  const CustomBar = useCallback((props) => {
    const { fill, x, y, width, height, dataKey } = props
    const colors = locationColors[dataKey] || { main: "#6B7280", light: "#9CA3AF" }

    if (height === 0) return null

    return (
      <g>
        {/* Sombra */}
        <rect x={x + 2} y={y + 2} width={width - 4} height={height - 2} fill="rgba(0, 0, 0, 0.08)" rx={6} ry={6} />
        
        {/* Barra principal com gradiente */}
        <defs>
          <linearGradient id={`barGradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.light} stopOpacity={0.9} />
            <stop offset="100%" stopColor={colors.main} stopOpacity={1} />
          </linearGradient>
        </defs>
        
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={`url(#barGradient-${dataKey})`}
          rx={6}
          ry={6}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={1}
        />
        
        {/* Efeito de brilho no topo */}
        <rect
          x={x + 1}
          y={y + 1}
          width={width - 2}
          height={Math.min(height / 4, 15)}
          fill="rgba(255, 255, 255, 0.25)"
          rx={4}
          ry={4}
        />
        
        {/* Efeito de brilho na lateral */}
        <rect x={x + width - 2} y={y + 2} width={1} height={height - 4} fill="rgba(255, 255, 255, 0.3)" rx={0.5} />
      </g>
    )
  }, [])

  if (loading || !mounted) {
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
            {loading ? "Carregando dados de localização..." : "Inicializando..."}
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
                background: `linear-gradient(135deg, ${alpha("#3B82F6", 0.1)}, ${alpha("#F59E0B", 0.05)})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${alpha("#3B82F6", 0.15)}`,
              }}
            >
              <DirectionsCar
                sx={{
                  color: "#3B82F6",
                  fontSize: "1.5rem",
                }}
              />
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
                Veículos por Localização
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
                  Distribuição entre garagem e manutenção
                </Typography>
              </Box>
            </Box>
          </Box>
        }
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ToggleButtonGroup
              value={chartView}
              exclusive
              onChange={handleChartViewChange}
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
                    background: `linear-gradient(135deg, #3B82F6, #F59E0B)`,
                    color: "white",
                    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                    border: "1px solid transparent",
                    "&:hover": {
                      background: `linear-gradient(135deg, #2563EB, #D97706)`,
                    },
                  },
                  "&:hover": {
                    backgroundColor: alpha("#3B82F6", 0.06),
                  },
                },
              }}
            >
              <ToggleButton value="grouped">
                <Tooltip title="Barras Agrupadas" arrow>
                  <BarChartIcon sx={{ fontSize: "1.1rem" }} />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="stacked">
                <Tooltip title="Barras Empilhadas" arrow>
                  <CompareArrows sx={{ fontSize: "1.1rem" }} />
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
                  background: `linear-gradient(135deg, #3B82F6, #F59E0B)`,
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
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
              barGap={chartView === "grouped" ? 10 : 0}
              barCategoryGap={chartView === "grouped" ? 40 : 20}
            >
              <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.15" />
                  <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.08" />
                </filter>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" vertical={false} />
              
              <XAxis
                dataKey="tipo"
                tick={{
                  fill: "#6B7280",
                  fontSize: 12,
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
                  fontSize: 12,
                  fontWeight: 500,
                }}
                axisLine={false}
                tickLine={false}
                dx={-8}
              />
              
              <RechartsTooltip content={CustomTooltip} cursor={{ fill: "rgba(0, 0, 0, 0.02)" }} />
              <Legend content={CustomLegend} />

              {chartView === "stacked" ? (
                <>
                  <Bar
                    dataKey="garagem"
                    name="Garagem"
                    stackId="a"
                    fill={locationColors.garagem.main}
                    shape={CustomBar}
                    isAnimationActive={animationActive}
                    animationDuration={800}
                    animationEasing="ease-out"
                    filter="url(#shadow)"
                  />
                  <Bar
                    dataKey="manutencao"
                    name="Manutenção"
                    stackId="a"
                    fill={locationColors.manutencao.main}
                    shape={CustomBar}
                    isAnimationActive={animationActive}
                    animationDuration={800}
                    animationEasing="ease-out"
                    filter="url(#shadow)"
                  />
                </>
              ) : (
                <>
                  <Bar
                    dataKey="garagem"
                    name="Garagem"
                    fill={locationColors.garagem.main}
                    shape={CustomBar}
                    isAnimationActive={animationActive}
                    animationDuration={800}
                    animationEasing="ease-out"
                    filter="url(#shadow)"
                  />
                  <Bar
                    dataKey="manutencao"
                    name="Manutenção"
                    fill={locationColors.manutencao.main}
                    shape={CustomBar}
                    isAnimationActive={animationActive}
                    animationDuration={800}
                    animationEasing="ease-out"
                    filter="url(#shadow)"
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Resumo de totais */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: "1px solid rgba(0, 0, 0, 0.05)",
            borderRadius: "12px",
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))`,
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "#6B7280",
              fontWeight: 500,
              mb: 1,
            }}
          >
            Resumo de Localização
          </Typography>
          
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: { xs: 2, md: 4 },
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1,
                borderRadius: "12px",
                background: alpha(locationColors.garagem.main, 0.1),
              }}
            >
              <Garage sx={{ color: locationColors.garagem.main, fontSize: "1.2rem" }} />
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Garagem: <span style={{ color: locationColors.garagem.main }}>{totals.garagem}</span>
              </Typography>
            </Box>
            
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1,
                borderRadius: "12px",
                background: alpha(locationColors.manutencao.main, 0.1),
              }}
            >
              <Build sx={{ color: locationColors.manutencao.main, fontSize: "1.2rem" }} />
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Manutenção: <span style={{ color: locationColors.manutencao.main }}>{totals.manutencao}</span>
              </Typography>
            </Box>
            
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1,
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${alpha("#3B82F6", 0.05)}, ${alpha("#F59E0B", 0.05)})`,
                border: "1px solid rgba(0, 0, 0, 0.03)",
              }}
            >
              <DirectionsCar sx={{ color: "#3B82F6", fontSize: "1.2rem" }} />
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #3B82F6, #F59E0B)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Total: {totals.total}
              </Typography>
            </Box>
          </Box>
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
}

export default VehicleLocationChart

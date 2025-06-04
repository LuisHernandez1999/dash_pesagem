"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, Box, Typography, IconButton, alpha, Chip, Tooltip } from "@mui/material"
import { Refresh, TrendingUp, AccessTime, Garage, Build, DirectionsCar } from "@mui/icons-material"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const VehicleLocationChart = ({ vehicleData, loading = false, onRefresh, themeColors }) => {
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
      main: "#8B5CF6", // Roxo
      light: "#A78BFA",
      dark: "#7C3AED",
      gradient: ["#8B5CF6", "#A78BFA"],
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
    // Sempre usar dados mockados para demonstração
    const mockData = [
      {
        tipo: "Caminhão Carroceria",
        garagem: 15,
        manutencao: 4,
        total: 19,
      },
      {
        tipo: "Retroescavadeira",
        garagem: 12,
        manutencao: 3,
        total: 15,
      },
      {
        tipo: "Pá Carregadeira",
        garagem: 8,
        manutencao: 2,
        total: 10,
      },
      {
        tipo: "Trator",
        garagem: 6,
        manutencao: 1,
        total: 7,
      },
      {
        tipo: "Caminhão Basculante",
        garagem: 5,
        manutencao: 2,
        total: 7,
      },
      {
        tipo: "Motoniveladora",
        garagem: 3,
        manutencao: 1,
        total: 4,
      },
    ]

    // Se não temos dados reais, usar dados mockados
    if (!vehicleData || !vehicleData.todos || vehicleData.todos.length === 0) {
      console.log("Usando dados mockados para o gráfico de localização")
      return mockData
    }

    // Processamento dos dados reais (quando disponíveis)
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
      } else if (normalizedType.includes("trator")) {
        type = "Trator"
      } else if (normalizedType.includes("basculante")) {
        type = "Caminhão Basculante"
      } else if (normalizedType.includes("motoniveladora") || normalizedType.includes("niveladora")) {
        type = "Motoniveladora"
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
    const processedData = Object.entries(equipmentTypes).map(([tipo, stats]) => ({
      tipo,
      garagem: stats.garagem,
      manutencao: stats.manutencao,
      total: stats.total,
    }))

    return processedData.length > 0 ? processedData : mockData
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
      { garagem: 0, manutencao: 0, total: 0 },
    )
  }, [chartData])

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
  const CustomTooltip = useCallback(({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            border: "none",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 20px 60px rgba(139, 92, 246, 0.15)",
            minWidth: "240px",
            backdropFilter: "blur(30px)",
            position: "relative",
            overflow: "hidden",
            border: `1px solid ${alpha("#8B5CF6", 0.1)}`,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              color: "#1F2937",
              mb: 2,
              fontSize: "1.2rem",
              textAlign: "center",
              letterSpacing: "-0.025em",
              background: "linear-gradient(135deg, #8B5CF6, #F59E0B)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {label}
          </Typography>

          <Box sx={{ mb: 2, textAlign: "center" }}>
            <Chip
              label={`${payload.reduce((sum, entry) => sum + entry.value, 0)} veículos`}
              size="small"
              sx={{
                backgroundColor: alpha("#8B5CF6", 0.1),
                color: "#8B5CF6",
                fontWeight: 600,
                fontSize: "0.8rem",
                height: "28px",
                borderRadius: "14px",
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
                  mb: 1.5,
                  p: 2,
                  borderRadius: "16px",
                  background: `linear-gradient(135deg, ${alpha(colors.main, 0.08)}, ${alpha(colors.light, 0.04)})`,
                  border: `1px solid ${alpha(colors.main, 0.15)}`,
                  transition: "all 0.3s ease",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${colors.main}, ${colors.light})`,
                      boxShadow: `0 4px 12px ${alpha(colors.main, 0.4)}`,
                    }}
                  />
                  <Typography
                    sx={{
                      color: "#374151",
                      fontSize: "0.9rem",
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
                    fontSize: "1rem",
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
  }, [])

  // Legenda personalizada
  const CustomLegend = useCallback(
    ({ payload }) => {
      if (!payload) return null

      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            mt: 4,
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
                  gap: 2,
                  p: 2.5,
                  borderRadius: "20px",
                  background: `linear-gradient(135deg, ${alpha(colors.main, 0.1)}, ${alpha(colors.light, 0.05)})`,
                  border: `2px solid ${alpha(colors.main, 0.2)}`,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  "&:hover": {
                    background: `linear-gradient(135deg, ${alpha(colors.main, 0.2)}, ${alpha(colors.light, 0.1)})`,
                    transform: "translateY(-4px) scale(1.05)",
                    boxShadow: `0 12px 32px ${alpha(colors.main, 0.3)}`,
                  },
                }}
              >
                {locationKey === "garagem" ? (
                  <Garage sx={{ color: colors.main, fontSize: "1.4rem" }} />
                ) : (
                  <Build sx={{ color: colors.main, fontSize: "1.4rem" }} />
                )}
                <Box>
                  <Typography
                    sx={{
                      color: "#374151",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      mb: 0.5,
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
                      fontSize: "1rem",
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
    [totals],
  )

  // Barra personalizada com gradiente e efeitos
  const CustomBar = useCallback((props) => {
    const { fill, x, y, width, height, dataKey } = props
    const colors = locationColors[dataKey] || { main: "#6B7280", light: "#9CA3AF" }

    if (height === 0) return null

    return (
      <g>
        {/* Sombra mais pronunciada */}
        <rect x={x + 3} y={y + 3} width={width - 6} height={height - 3} fill="rgba(139, 92, 246, 0.15)" rx={8} ry={8} />

        {/* Barra principal com gradiente */}
        <defs>
          <linearGradient id={`barGradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.light} stopOpacity={1} />
            <stop offset="100%" stopColor={colors.main} stopOpacity={1} />
          </linearGradient>
          <linearGradient id={`barShine-${dataKey}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.1)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
          </linearGradient>
        </defs>

        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={`url(#barGradient-${dataKey})`}
          rx={8}
          ry={8}
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth={2}
        />

        {/* Efeito de brilho no topo */}
        <rect
          x={x + 2}
          y={y + 2}
          width={width - 4}
          height={Math.min(height / 3, 20)}
          fill="url(#barShine-${dataKey})"
          rx={6}
          ry={6}
        />

        {/* Efeito de brilho na lateral */}
        <rect x={x + width - 3} y={y + 3} width={2} height={height - 6} fill="rgba(255, 255, 255, 0.4)" rx={1} />
      </g>
    )
  }, [])

  if (loading || !mounted) {
    return (
      <Card
        sx={{
          borderRadius: "24px",
          boxShadow: "0 8px 32px rgba(139, 92, 246, 0.1)",
          mb: 4,
          border: "1px solid rgba(139, 92, 246, 0.1)",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
        }}
      >
        <CardContent sx={{ padding: "3rem", textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: "1.1rem",
              color: "#8B5CF6",
              fontWeight: 600,
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
        borderRadius: "24px",
        boxShadow: "0 8px 32px rgba(139, 92, 246, 0.1)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        "&:hover": {
          boxShadow: "0 16px 48px rgba(139, 92, 246, 0.2)",
          transform: "translateY(-4px)",
        },
        background: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(30px)",
        mb: 4,
        border: "1px solid rgba(139, 92, 246, 0.1)",
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${alpha("#8B5CF6", 0.15)}, ${alpha("#F59E0B", 0.1)})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px solid ${alpha("#8B5CF6", 0.2)}`,
                boxShadow: `0 8px 24px ${alpha("#8B5CF6", 0.2)}`,
              }}
            >
              <DirectionsCar
                sx={{
                  color: "#8B5CF6",
                  fontSize: "1.8rem",
                }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  background: "linear-gradient(135deg, #8B5CF6, #F59E0B)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.025em",
                  mb: 0.5,
                }}
              >
                Veículos por Localização
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <TrendingUp
                  sx={{
                    fontSize: "1rem",
                    color: "#10B981",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.9rem",
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
          <Tooltip title="Atualizar dados" arrow>
            <IconButton
              sx={{
                color: "white",
                background: `linear-gradient(135deg, #8B5CF6, #A78BFA)`,
                borderRadius: "16px",
                width: "48px",
                height: "48px",
                border: `2px solid ${alpha("#8B5CF6", 0.3)}`,
                transition: "all 0.3s ease",
                boxShadow: `0 8px 24px ${alpha("#8B5CF6", 0.3)}`,
                "&:hover": {
                  background: `linear-gradient(135deg, #7C3AED, #8B5CF6)`,
                  transform: "rotate(180deg) scale(1.1)",
                  boxShadow: `0 12px 32px ${alpha("#8B5CF6", 0.4)}`,
                },
              }}
              onClick={handleRefresh}
            >
              <Refresh sx={{ fontSize: "1.3rem" }} />
            </IconButton>
          </Tooltip>
        }
        sx={{
          padding: "2rem",
          paddingBottom: "1.5rem",
          borderBottom: `1px solid ${alpha("#8B5CF6", 0.1)}`,
          "& .MuiCardHeader-action": {
            margin: 0,
          },
        }}
      />

      <CardContent sx={{ padding: "2rem" }}>
        <Box
          sx={{
            width: "100%",
            height: "500px",
            position: "relative",
            borderRadius: "20px",
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6))`,
            padding: "1.5rem",
            border: `1px solid ${alpha("#8B5CF6", 0.1)}`,
            backdropFilter: "blur(20px)",
            boxShadow: `inset 0 2px 8px ${alpha("#8B5CF6", 0.05)}`,
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 30,
                right: 40,
                left: 30,
                bottom: 30,
              }}
              barGap={15}
              barCategoryGap={50}
            >
              <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#8B5CF6" floodOpacity="0.2" />
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.1" />
                </filter>
              </defs>

              <CartesianGrid strokeDasharray="4 4" stroke={alpha("#8B5CF6", 0.1)} vertical={false} />

              <XAxis
                dataKey="tipo"
                tick={{
                  fill: "#6B7280",
                  fontSize: 13,
                  fontWeight: 600,
                }}
                axisLine={{
                  stroke: alpha("#8B5CF6", 0.2),
                  strokeWidth: 2,
                }}
                tickLine={false}
                dy={12}
              />

              <YAxis
                tick={{
                  fill: "#6B7280",
                  fontSize: 13,
                  fontWeight: 600,
                }}
                axisLine={false}
                tickLine={false}
                dx={-12}
              />

              <RechartsTooltip content={CustomTooltip} cursor={{ fill: alpha("#8B5CF6", 0.05) }} />
              <Legend content={CustomLegend} />

              <Bar
                dataKey="garagem"
                name="Garagem"
                fill={locationColors.garagem.main}
                shape={CustomBar}
                isAnimationActive={animationActive}
                animationDuration={1000}
                animationEasing="ease-out"
                filter="url(#shadow)"
              />
              <Bar
                dataKey="manutencao"
                name="Manutenção"
                fill={locationColors.manutencao.main}
                shape={CustomBar}
                isAnimationActive={animationActive}
                animationDuration={1000}
                animationEasing="ease-out"
                filter="url(#shadow)"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Resumo de totais */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: `1px solid ${alpha("#8B5CF6", 0.1)}`,
            borderRadius: "16px",
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5))`,
            padding: "1.5rem",
            textAlign: "center",
            boxShadow: `inset 0 2px 8px ${alpha("#8B5CF6", 0.05)}`,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.9rem",
              color: "#6B7280",
              fontWeight: 600,
              mb: 2,
            }}
          >
            Resumo de Localização
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: { xs: 3, md: 5 },
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: "16px",
                background: alpha(locationColors.garagem.main, 0.1),
                border: `1px solid ${alpha(locationColors.garagem.main, 0.2)}`,
              }}
            >
              <Garage sx={{ color: locationColors.garagem.main, fontSize: "1.4rem" }} />
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 700,
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
                gap: 1.5,
                p: 1.5,
                borderRadius: "16px",
                background: alpha(locationColors.manutencao.main, 0.1),
                border: `1px solid ${alpha(locationColors.manutencao.main, 0.2)}`,
              }}
            >
              <Build sx={{ color: locationColors.manutencao.main, fontSize: "1.4rem" }} />
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 700,
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
                gap: 1.5,
                p: 1.5,
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${alpha("#8B5CF6", 0.1)}, ${alpha("#F59E0B", 0.1)})`,
                border: `1px solid ${alpha("#8B5CF6", 0.2)}`,
              }}
            >
              <DirectionsCar sx={{ color: "#8B5CF6", fontSize: "1.4rem" }} />
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #8B5CF6, #F59E0B)",
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
            gap: 1.5,
            mt: 3,
            pt: 2,
            borderTop: `1px solid ${alpha("#8B5CF6", 0.1)}`,
            borderRadius: "16px",
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5))`,
            padding: "1rem",
          }}
        >
          <AccessTime
            sx={{
              fontSize: "1.1rem",
              color: "#8B5CF6",
            }}
          />
          <Typography
            sx={{
              fontSize: "0.9rem",
              color: "#6B7280",
              fontWeight: 600,
            }}
          >
            Última atualização:{" "}
            <span style={{ color: "#8B5CF6", fontWeight: 700 }}>
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

"use client"

import { useState, useEffect } from "react"
import { Box, Typography, alpha, Chip, CircularProgress, Paper, Grid } from "@mui/material"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp, Assessment, LocationOn } from "@mui/icons-material"

// Cores modernas e gradientes para cada PA
const PA_COLORS = {
  PA1: {
    main: "#9c27b0",
    light: "#ba68c8",
    gradient: ["#9c27b0", "#e1bee7"],
    shadow: "rgba(156, 39, 176, 0.3)",
  },
  PA2: {
    main: "#2196f3",
    light: "#64b5f6",
    gradient: ["#2196f3", "#bbdefb"],
    shadow: "rgba(33, 150, 243, 0.3)",
  },
  PA3: {
    main: "#ff9800",
    light: "#ffb74d",
    gradient: ["#ff9800", "#ffe0b2"],
    shadow: "rgba(255, 152, 0, 0.3)",
  },
  PA4: {
    main: "#4caf50",
    light: "#81c784",
    gradient: ["#4caf50", "#c8e6c9"],
    shadow: "rgba(76, 175, 80, 0.3)",
  },
}

// Dados mock para demonstração
const MOCK_DATA = [
  { name: "PA1", value: 25, color: PA_COLORS.PA1.main, fullName: "Ponto de Apoio 1" },
  { name: "PA2", value: 40, color: PA_COLORS.PA2.main, fullName: "Ponto de Apoio 2" },
  { name: "PA3", value: 30, color: PA_COLORS.PA3.main, fullName: "Ponto de Apoio 3" },
  { name: "PA4", value: 35, color: PA_COLORS.PA4.main, fullName: "Ponto de Apoio 4" },
]

const PADistributionPieChart = ({ themeColors, chartsLoaded = true }) => {
  const [data, setData] = useState(MOCK_DATA)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)
  const [total, setTotal] = useState(0)
  const [maxPA, setMaxPA] = useState(null)
  const [minPA, setMinPA] = useState(null)

  useEffect(() => {
    // Calcular estatísticas
    const totalValue = data.reduce((sum, item) => sum + item.value, 0)
    const maxItem = data.reduce((max, item) => (item.value > max.value ? item : max), data[0])
    const minItem = data.reduce((min, item) => (item.value < min.value ? item : min), data[0])

    setTotal(totalValue)
    setMaxPA(maxItem)
    setMinPA(minItem)
  }, [data])

  // Componente customizado para tooltip mais sofisticado
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = ((data.value / total) * 100).toFixed(1)
      const paConfig = PA_COLORS[data.name]

      return (
        <Paper
          elevation={8}
          sx={{
            background: `linear-gradient(135deg, ${alpha("#ffffff", 0.95)} 0%, ${alpha("#f8f9fa", 0.95)} 100%)`,
            borderRadius: "16px",
            padding: "20px",
            border: `3px solid ${data.payload.color}`,
            backdropFilter: "blur(12px)",
            minWidth: "220px",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "16px",
              height: "16px",
              background: data.payload.color,
              borderRadius: "50%",
              boxShadow: `0 0 20px ${paConfig?.shadow || "rgba(0,0,0,0.3)"}`,
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <LocationOn sx={{ color: data.payload.color, mr: 1, fontSize: "1.2rem" }} />
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.1rem",
                color: data.payload.color,
              }}
            >
              {data.payload.fullName || data.name}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Assessment sx={{ color: "#666", mr: 1, fontSize: "1rem" }} />
            <Typography sx={{ fontWeight: 700, fontSize: "1.4rem", color: "#1a1a1a" }}>{data.value} saídas</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <TrendingUp sx={{ color: data.payload.color, mr: 1, fontSize: "1rem" }} />
            <Typography sx={{ fontSize: "1rem", color: "#666", fontWeight: 600 }}>{percentage}% do total</Typography>
          </Box>

          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${alpha(data.payload.color, 0.2)}`,
              background: `linear-gradient(90deg, ${alpha(data.payload.color, 0.1)} 0%, transparent 100%)`,
              borderRadius: "8px",
              padding: "8px",
            }}
          >
            <Typography sx={{ fontSize: "0.85rem", color: "#888", fontStyle: "italic" }}>
              {data.value === maxPA?.value
                ? "🏆 Maior volume"
                : data.value === minPA?.value
                  ? "📊 Menor volume"
                  : "📈 Volume médio"}
            </Typography>
          </Box>
        </Paper>
      )
    }
    return null
  }

  // Labels customizados mais elegantes
  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    // Só mostrar label se a porcentagem for maior que 8%
    if (percent < 0.08) return null

    return (
      <g>
        <circle
          cx={x}
          cy={y}
          r="18"
          fill="rgba(255, 255, 255, 0.9)"
          stroke={PA_COLORS[name]?.main || "#666"}
          strokeWidth="2"
        />
        <text
          x={x}
          y={y - 2}
          fill={PA_COLORS[name]?.main || "#666"}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="12"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          {value}
        </text>
        <text
          x={x}
          y={y + 10}
          fill={PA_COLORS[name]?.main || "#666"}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="8"
          fontWeight="600"
          fontFamily="Inter, sans-serif"
        >
          {name}
        </text>
      </g>
    )
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "500px",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={50} thickness={4} />
        <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 500 }}>
          Carregando distribuição por PA...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {/* Header mais sofisticado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          px: 2,
          py: 1,
          background: `linear-gradient(135deg, ${alpha("#f8f9fa", 0.8)} 0%, ${alpha("#e9ecef", 0.8)} 100%)`,
          borderRadius: "12px",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Assessment sx={{ color: themeColors?.info?.main || "#8338ec", fontSize: "1.5rem" }} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: "1.3rem",
              color: themeColors?.text?.primary || "#1e293b",
              background: `linear-gradient(135deg, ${themeColors?.text?.primary || "#1e293b"} 0%, ${themeColors?.info?.main || "#8338ec"} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Distribuição por PA
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            background: `linear-gradient(135deg, ${themeColors?.info?.main || "#8338ec"} 0%, ${themeColors?.info?.light || "#9c5ff0"} 100%)`,
            borderRadius: "16px",
            padding: "8px 16px",
            color: "white",
            boxShadow: `0 4px 20px ${alpha(themeColors?.info?.main || "#8338ec", 0.3)}`,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            Total: {total} saídas
          </Typography>
        </Paper>
      </Box>

      {/* Gráfico de pizza maior e mais bonito */}
      <Box sx={{ width: "100%", height: "420px", position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {data.map((entry, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`gradient-${entry.name}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={PA_COLORS[entry.name]?.main || entry.color} />
                  <stop offset="100%" stopColor={PA_COLORS[entry.name]?.light || entry.color} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={140}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={1200}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient-${entry.name})`}
                  stroke="rgba(255, 255, 255, 0.8)"
                  strokeWidth={activeIndex === index ? 4 : 2}
                  style={{
                    filter:
                      activeIndex === index
                        ? "brightness(1.1) drop-shadow(0 8px 16px rgba(0,0,0,0.2))"
                        : "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                    transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                    transformOrigin: "center",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Centro do gráfico com informações */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "50%",
            width: "100px",
            height: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            border: "3px solid rgba(255,255,255,0.8)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.2rem",
              color: themeColors?.text?.primary || "#1e293b",
            }}
          >
            {total}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.7rem",
              color: themeColors?.text?.secondary || "#64748b",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            TOTAL
          </Typography>
        </Box>
      </Box>

      {/* Cards de estatísticas mais profissionais */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1)
          const paConfig = PA_COLORS[item.name]
          const isMax = item.value === maxPA?.value
          const isMin = item.value === minPA?.value

          return (
            <Grid item xs={6} sm={3} key={index}>
              <Paper
                elevation={activeIndex === index ? 8 : 2}
                sx={{
                  padding: "16px",
                  borderRadius: "16px",
                  background: `linear-gradient(135deg, ${alpha(item.color, 0.05)} 0%, ${alpha(item.color, 0.02)} 100%)`,
                  border: `2px solid ${alpha(item.color, activeIndex === index ? 0.3 : 0.1)}`,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: activeIndex === index ? "translateY(-4px)" : "translateY(0)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 25px ${paConfig?.shadow || "rgba(0,0,0,0.15)"}`,
                    border: `2px solid ${alpha(item.color, 0.4)}`,
                  },
                }}
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${item.color} 0%, ${paConfig?.light || item.color} 100%)`,
                      mr: 1,
                      boxShadow: `0 2px 8px ${paConfig?.shadow || "rgba(0,0,0,0.2)"}`,
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: item.color,
                    }}
                  >
                    {item.name}
                  </Typography>
                  {isMax && <Typography sx={{ ml: 0.5, fontSize: "0.8rem" }}>🏆</Typography>}
                  {isMin && <Typography sx={{ ml: 0.5, fontSize: "0.8rem" }}>📊</Typography>}
                </Box>

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.8rem",
                    color: item.color,
                    lineHeight: 1,
                    mb: 0.5,
                  }}
                >
                  {percentage}%
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: themeColors?.text?.secondary || "#64748b",
                    fontWeight: 500,
                  }}
                >
                  {item.value} saídas
                </Typography>
              </Paper>
            </Grid>
          )
        })}
      </Grid>

      {/* Legenda com chips melhorados */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          flexWrap: "wrap",
          mt: 3,
          p: 2,
          background: `linear-gradient(135deg, ${alpha("#f8f9fa", 0.6)} 0%, ${alpha("#e9ecef", 0.6)} 100%)`,
          borderRadius: "12px",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {data.map((entry, index) => {
          const paConfig = PA_COLORS[entry.name]
          return (
            <Chip
              key={index}
              icon={
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${entry.color} 0%, ${paConfig?.light || entry.color} 100%)`,
                    boxShadow: `0 2px 6px ${paConfig?.shadow || "rgba(0,0,0,0.2)"}`,
                  }}
                />
              }
              label={`${entry.fullName || entry.name}: ${entry.value} saídas`}
              size="medium"
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              sx={{
                background: `linear-gradient(135deg, ${alpha(entry.color, 0.1)} 0%, ${alpha(entry.color, 0.05)} 100%)`,
                color: entry.color,
                fontWeight: 600,
                fontSize: "0.85rem",
                height: "36px",
                border: `2px solid ${alpha(entry.color, 0.2)}`,
                cursor: "pointer",
                "&:hover": {
                  background: `linear-gradient(135deg, ${alpha(entry.color, 0.2)} 0%, ${alpha(entry.color, 0.1)} 100%)`,
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 12px ${paConfig?.shadow || "rgba(0,0,0,0.15)"}`,
                  border: `2px solid ${alpha(entry.color, 0.4)}`,
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default PADistributionPieChart

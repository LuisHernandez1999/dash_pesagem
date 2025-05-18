"use client"

import { useEffect, useState, useCallback } from "react"
import { Box, Typography, alpha, CircularProgress, Chip, Tooltip as MuiTooltip } from "@mui/material"
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip, PolarGrid, PolarAngleAxis } from "recharts"
import { LocalShipping, Speed, TrendingUp, CalendarToday } from "@mui/icons-material"

// Definição local de keyframes para evitar o erro
const localKeyframes = {
  pulse: `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.03); }
      100% { transform: scale(1); }
    }
  `,
}

export default function EquipeDistribution({ themeColors, chartsLoaded, keyframes = {} }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalVeiculos, setTotalVeiculos] = useState(0)
  const [hoveredPA, setHoveredPA] = useState(null)
  const [animationComplete, setAnimationComplete] = useState(false)

  // Usar keyframes locais ou os passados via props
  const pulseAnimation = keyframes?.pulse ? keyframes.pulse : localKeyframes.pulse

  useEffect(() => {
    if (chartsLoaded) {
      // Dados do dia
      const mockData = [
        {
          name: "PA1",
          veiculos: 24,
          percentual: 38.7,
          tendencia: "+5%",
          ultimaSaida: "08:45",
          baseColor: themeColors.primary.main,
          fill: "url(#colorPA1)",
        },
        {
          name: "PA2",
          veiculos: 18,
          percentual: 29.0,
          tendencia: "+2%",
          ultimaSaida: "09:12",
          baseColor: themeColors.success.main,
          fill: "url(#colorPA2)",
        },
        {
          name: "PA3",
          veiculos: 12,
          percentual: 19.4,
          tendencia: "-3%",
          ultimaSaida: "07:50",
          baseColor: themeColors.warning.main,
          fill: "url(#colorPA3)",
        },
        {
          name: "PA4",
          veiculos: 8,
          percentual: 12.9,
          tendencia: "+1%",
          ultimaSaida: "08:30",
          baseColor: themeColors.info.main,
          fill: "url(#colorPA4)",
        },
      ]

      // Calcular o total de veículos
      const total = mockData.reduce((sum, item) => sum + item.veiculos, 0)
      setTotalVeiculos(total)
      setData(mockData)
      setLoading(false)

      // Simular animação completa após 1.5 segundos
      setTimeout(() => {
        setAnimationComplete(true)
      }, 1500)
    }
  }, [chartsLoaded])

  const handleMouseEnter = useCallback((data) => {
    setHoveredPA(data.name)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredPA(null)
  }, [])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <Box
          sx={{
            backgroundColor: themeColors.background.paper,
            border: `1px solid ${item.baseColor}`,
            borderRadius: "10px",
            padding: "16px",
            boxShadow: `0 6px 16px ${alpha(item.baseColor, 0.2)}`,
            minWidth: "220px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: item.baseColor,
              }}
            >
              {item.name}
            </Typography>
            <Chip
              label={item.tendencia}
              size="small"
              icon={<TrendingUp fontSize="small" />}
              sx={{
                backgroundColor: item.tendencia.startsWith("+")
                  ? alpha(themeColors.success.main, 0.1)
                  : alpha(themeColors.error.main, 0.1),
                color: item.tendencia.startsWith("+") ? themeColors.success.main : themeColors.error.main,
                fontWeight: 600,
                "& .MuiChip-icon": {
                  color: "inherit",
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <LocalShipping sx={{ color: item.baseColor, fontSize: "1.2rem" }} />
              <Typography sx={{ fontSize: "1rem", color: themeColors.text.primary }}>
                <strong>{item.veiculos}</strong> veículos ({item.percentual}%)
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CalendarToday sx={{ color: item.baseColor, fontSize: "1.2rem" }} />
              <Typography sx={{ fontSize: "1rem", color: themeColors.text.primary }}>
                Última saída: <strong>{item.ultimaSaida}</strong>
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
          mt: 3,
        }}
      >
        {payload.map((entry, index) => (
          <MuiTooltip
            key={`legend-${index}`}
            title={`Tendência: ${entry.payload.tendencia} | Última saída: ${entry.payload.ultimaSaida}`}
            arrow
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                padding: "6px 12px",
                borderRadius: "8px",
                backgroundColor: alpha(entry.payload.baseColor, 0.05),
                border: `1px solid ${alpha(entry.payload.baseColor, 0.1)}`,
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: alpha(entry.payload.baseColor, 0.1),
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 8px ${alpha(entry.payload.baseColor, 0.15)}`,
                },
                ...(hoveredPA === entry.payload.name && {
                  backgroundColor: alpha(entry.payload.baseColor, 0.15),
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 8px ${alpha(entry.payload.baseColor, 0.2)}`,
                }),
              }}
              onMouseEnter={() => handleMouseEnter(entry.payload)}
              onMouseLeave={handleMouseLeave}
            >
              <Box
                sx={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "4px",
                  background: `linear-gradient(135deg, ${entry.payload.baseColor}, ${alpha(entry.payload.baseColor, 0.7)})`,
                }}
              />
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: themeColors.text.primary,
                }}
              >
                {entry.value}: <strong>{entry.payload.veiculos}</strong> veículos
              </Typography>
              <Chip
                label={`${entry.payload.percentual}%`}
                size="small"
                sx={{
                  height: "20px",
                  backgroundColor: alpha(entry.payload.baseColor, 0.1),
                  color: entry.payload.baseColor,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              />
            </Box>
          </MuiTooltip>
        ))}
      </Box>
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
        }}
      >
        <CircularProgress size={40} sx={{ color: themeColors.primary.main }} />
      </Box>
    )
  }

  return (
    <>
      <style>{pulseAnimation}</style>

      {/* Título e subtítulo */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
          Veículos por Ponto de Apoio
        </Typography>
        <Typography variant="body1" sx={{ color: themeColors.text.secondary }}>
          Veículos que saíram hoje
        </Typography>
      </Box>

      <Box sx={{ width: "100%", height: 500, position: "relative" }}>
        {/* Total no centro */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: animationComplete ? `pulse 3s infinite ease-in-out` : "none",
          }}
        >
          <Box
            sx={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${alpha(themeColors.primary.main, 0.1)}, ${alpha(themeColors.info.main, 0.1)})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 20px ${alpha(themeColors.primary.main, 0.15)}`,
              border: `2px solid ${alpha(themeColors.primary.main, 0.1)}`,
            }}
          >
            <Typography
              sx={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: themeColors.primary.main,
                lineHeight: 1,
              }}
            >
              {totalVeiculos}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.9rem",
                color: themeColors.text.secondary,
                mt: 0.5,
              }}
            >
              veículos
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 0.5 }}>
            <Speed sx={{ color: themeColors.primary.main, fontSize: "1rem" }} />
            <Typography sx={{ fontSize: "0.9rem", color: themeColors.text.secondary }}>Atualizado às 10:15</Typography>
          </Box>
        </Box>

        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="30%"
            outerRadius="90%"
            barSize={30}
            data={data}
            startAngle={180}
            endAngle={-180}
            barGap={8}
          >
            <defs>
              <linearGradient id="colorPA1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={themeColors.primary.main} stopOpacity={1} />
                <stop offset="100%" stopColor={alpha(themeColors.primary.main, 0.7)} stopOpacity={1} />
              </linearGradient>
              <linearGradient id="colorPA2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={themeColors.success.main} stopOpacity={1} />
                <stop offset="100%" stopColor={alpha(themeColors.success.main, 0.7)} stopOpacity={1} />
              </linearGradient>
              <linearGradient id="colorPA3" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={themeColors.warning.main} stopOpacity={1} />
                <stop offset="100%" stopColor={alpha(themeColors.warning.main, 0.7)} stopOpacity={1} />
              </linearGradient>
              <linearGradient id="colorPA4" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={themeColors.info.main} stopOpacity={1} />
                <stop offset="100%" stopColor={alpha(themeColors.info.main, 0.7)} stopOpacity={1} />
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={alpha(themeColors.primary.main, 0.3)} />
              </filter>
            </defs>
            <PolarGrid gridType="circle" radialLines={false} />
            <PolarAngleAxis
              type="number"
              domain={[0, Math.max(...data.map((d) => d.veiculos)) * 1.1]}
              tick={false}
              axisLine={false}
            />
            <RadialBar
              minAngle={15}
              label={{
                position: "insideStart",
                fill: "#ffffff",
                fontSize: 14,
                fontWeight: "bold",
                formatter: (value, entry) => (entry && entry.name ? `${entry.name}: ${value}` : value),
              }}
              background={{ fill: alpha(themeColors.background.default, 0.5) }}
              dataKey="veiculos"
              cornerRadius={10}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              animationDuration={1500}
              animationBegin={300}
              animationEasing="ease-out"
              filter="url(#shadow)"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconSize={12}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              content={<CustomLegend />}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </Box>
    </>
  )
}

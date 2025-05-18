"use client"

import { useEffect, useState, useRef } from "react"
import { Box, Typography, alpha, CircularProgress, Paper, useTheme, useMediaQuery, Chip } from "@mui/material"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  LabelList,
} from "recharts"
import { TrendingUp, CalendarToday } from "@mui/icons-material"

export default function GraficoVarricaoSemanal({ themeColors, chartsLoaded }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredBar, setHoveredBar] = useState(null)
  const [mediaKm, setMediaKm] = useState(0)
  const [melhorDia, setMelhorDia] = useState({ dia: "", valor: 0 })
  const chartRef = useRef(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Cores para cada dia da semana
  const dayColors = {
    Segunda: {
      main: "#4CAF50", // Verde
      light: "#81C784",
    },
    Terça: {
      main: "#2196F3", // Azul
      light: "#64B5F6",
    },
    Quarta: {
      main: "#9C27B0", // Roxo
      light: "#BA68C8",
    },
    Quinta: {
      main: "#FF9800", // Laranja
      light: "#FFB74D",
    },
    Sexta: {
      main: "#F44336", // Vermelho
      light: "#E57373",
    },
    Sábado: {
      main: "#00BCD4", // Ciano
      light: "#4DD0E1",
    },
    Domingo: {
      main: "#607D8B", // Azul acinzentado
      light: "#90A4AE",
    },
  }

  useEffect(() => {
    if (chartsLoaded) {
      // Simular chamada à API
      setTimeout(() => {
        const mockData = [
          {
            name: "Segunda",
            abrev: "Seg",
            kmVarridos: 42,
            eficiencia: 85,
            residuos: 1.2,
            meta: 40,
            equipes: 8,
            color: dayColors.Segunda.main,
            lightColor: dayColors.Segunda.light,
            fill: `url(#colorSegunda)`,
          },
          {
            name: "Terça",
            abrev: "Ter",
            kmVarridos: 48,
            eficiencia: 88,
            residuos: 1.4,
            meta: 40,
            equipes: 9,
            color: dayColors.Terça.main,
            lightColor: dayColors.Terça.light,
            fill: `url(#colorTerca)`,
          },
          {
            name: "Quarta",
            abrev: "Qua",
            kmVarridos: 52,
            eficiencia: 90,
            residuos: 1.5,
            meta: 40,
            equipes: 10,
            color: dayColors.Quarta.main,
            lightColor: dayColors.Quarta.light,
            fill: `url(#colorQuarta)`,
          },
          {
            name: "Quinta",
            abrev: "Qui",
            kmVarridos: 45,
            eficiencia: 87,
            residuos: 1.3,
            meta: 40,
            equipes: 9,
            color: dayColors.Quinta.main,
            lightColor: dayColors.Quinta.light,
            fill: `url(#colorQuinta)`,
          },
          {
            name: "Sexta",
            abrev: "Sex",
            kmVarridos: 50,
            eficiencia: 89,
            residuos: 1.4,
            meta: 40,
            equipes: 10,
            color: dayColors.Sexta.main,
            lightColor: dayColors.Sexta.light,
            fill: `url(#colorSexta)`,
          },
          {
            name: "Sábado",
            abrev: "Sáb",
            kmVarridos: 38,
            eficiencia: 82,
            residuos: 1.1,
            meta: 35,
            equipes: 7,
            color: dayColors.Sábado.main,
            lightColor: dayColors.Sábado.light,
            fill: `url(#colorSabado)`,
          },
          {
            name: "Domingo",
            abrev: "Dom",
            kmVarridos: 30,
            eficiencia: 78,
            residuos: 0.9,
            meta: 30,
            equipes: 6,
            color: dayColors.Domingo.main,
            lightColor: dayColors.Domingo.light,
            fill: `url(#colorDomingo)`,
          },
        ]

        // Calcular estatísticas
        const total = mockData.reduce((sum, item) => sum + item.kmVarridos, 0)
        const media = Math.round((total / mockData.length) * 10) / 10
        const melhor = mockData.reduce(
          (max, item) => (item.kmVarridos > max.valor ? { dia: item.name, valor: item.kmVarridos } : max),
          { dia: "", valor: 0 },
        )

        setMediaKm(media)
        setMelhorDia(melhor)
        setData(mockData)
        setLoading(false)
      }, 1000)
    }
  }, [chartsLoaded])

  const handleBarMouseEnter = (data, index) => {
    setHoveredBar(index)
  }

  const handleBarMouseLeave = () => {
    setHoveredBar(null)
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <Paper
          elevation={3}
          sx={{
            backgroundColor: alpha(themeColors.background.paper, 0.95),
            border: `1px solid ${alpha(item.color, 0.2)}`,
            borderRadius: "12px",
            padding: "16px",
            boxShadow: `0 8px 24px ${alpha(item.color, 0.15)}`,
            backdropFilter: "blur(8px)",
            minWidth: "250px",
            overflow: "hidden",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "5px",
              height: "100%",
              background: `linear-gradient(to bottom, ${item.color}, ${item.lightColor})`,
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: themeColors.text.primary,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CalendarToday sx={{ fontSize: "1rem", color: item.color }} />
              {item.name}
            </Typography>
            <Chip
              label={`${item.eficiencia}% eficiência`}
              size="small"
              icon={<TrendingUp fontSize="small" />}
              sx={{
                backgroundColor: alpha(item.color, 0.1),
                color: item.color,
                fontWeight: 600,
                "& .MuiChip-icon": {
                  color: "inherit",
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mb: 1.5,
              p: 1,
              backgroundColor: alpha(themeColors.background.default, 0.5),
              borderRadius: "8px",
            }}
          >
            <Box>
              <Typography sx={{ fontSize: "0.75rem", color: themeColors.text.secondary, mb: 0.5 }}>
                KM Varridos
              </Typography>
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, color: item.color }}>
                {item.kmVarridos} km
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.75rem", color: themeColors.text.secondary, mb: 0.5 }}>
                Resíduos Coletados
              </Typography>
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, color: themeColors.warning.main }}>
                {item.residuos} ton
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: "0.875rem", color: themeColors.text.secondary }}>
              Equipes em operação: <strong>{item.equipes}</strong>
            </Typography>
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: item.kmVarridos >= item.meta ? themeColors.success.main : themeColors.error.main,
                fontWeight: 600,
              }}
            >
              {item.kmVarridos >= item.meta ? "Meta atingida" : "Abaixo da meta"}
            </Typography>
          </Box>
        </Paper>
      )
    }
    return null
  }

  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value, index } = props
    const item = data[index]
    const radius = 10

    return (
      <g>
        <circle
          cx={x + width / 2}
          cy={y - radius}
          r={radius}
          fill={hoveredBar === index ? item.color : item.color}
          filter="url(#shadow)"
        />
        <text
          x={x + width / 2}
          y={y - radius}
          fill="#fff"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fontWeight="bold"
        >
          {value}
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
          height: "100%",
          width: "100%",
        }}
      >
        <CircularProgress size={40} sx={{ color: themeColors.primary.main }} />
      </Box>
    )
  }

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {/* Cabeçalho com estatísticas - versão compacta */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 1,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Paper
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
              backgroundColor: alpha(themeColors.success.main, 0.05),
              border: `1px solid ${alpha(themeColors.success.main, 0.1)}`,
            }}
          >
            <Typography variant="caption" sx={{ color: themeColors.text.secondary }}>
              Melhor:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: themeColors.success.main }}>
              {melhorDia.dia.substring(0, 3)}
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Gráfico principal */}
      <Box
        ref={chartRef}
        sx={{
          width: "100%",
          height: "calc(100% - 40px)", // Ajustado para considerar o cabeçalho
          position: "relative",
          "& .recharts-surface": {
            overflow: "visible",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 25,
              right: 20,
              left: 0,
              bottom: 5,
            }}
            barGap={4}
            barCategoryGap="15%"
          >
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0, 0, 0, 0.3)" />
              </filter>

              {data.map((entry) => (
                <linearGradient key={`color${entry.name}`} id={`color${entry.name}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={entry.lightColor} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.9} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(themeColors.divider, 0.6)} />

            <XAxis
              dataKey={isMobile ? "abrev" : "name"}
              tick={{
                fill: themeColors.text.secondary,
                fontSize: isMobile ? 9 : 10,
                fontWeight: 500,
              }}
              axisLine={{ stroke: themeColors.divider }}
              tickLine={{ stroke: themeColors.divider }}
              dy={5}
            />

            <YAxis
              tick={{
                fill: themeColors.text.secondary,
                fontSize: isMobile ? 9 : 10,
              }}
              axisLine={{ stroke: themeColors.divider }}
              tickLine={{ stroke: themeColors.divider }}
              width={25}
            />

            {/* Linha de meta */}
            {data.map((entry, index) => (
              <ReferenceLine
                key={`meta-${index}`}
                y={entry.meta}
                segment={[
                  { x: index - 0.35, y: entry.meta },
                  { x: index + 0.35, y: entry.meta },
                ]}
                stroke={themeColors.warning.main}
                strokeWidth={2}
                strokeDasharray="3 3"
                ifOverflow="extendDomain"
              />
            ))}

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: "transparent",
                strokeDasharray: "5 5",
                stroke: "#888",
                strokeWidth: 1,
                rx: 4,
                ry: 4,
              }}
            />

            <Bar
              dataKey="kmVarridos"
              radius={[6, 6, 0, 0]}
              onMouseEnter={handleBarMouseEnter}
              onMouseLeave={handleBarMouseLeave}
              barSize={isMobile ? 18 : 28}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              <LabelList dataKey="kmVarridos" position="top" content={renderCustomizedLabel} />
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  filter={hoveredBar === index ? "url(#shadow)" : "none"}
                  style={{
                    transition: "filter 0.3s ease",
                    cursor: "pointer",
                    opacity: hoveredBar === null || hoveredBar === index ? 1 : 0.7,
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Legenda simplificada */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 0.5,
          mb: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 2,
              borderRadius: "1px",
              backgroundColor: themeColors.warning.main,
            }}
          />
          <Typography sx={{ fontSize: "0.75rem", color: themeColors.text.secondary }}>Meta diária</Typography>
        </Box>
      </Box>
    </Box>
  )
}

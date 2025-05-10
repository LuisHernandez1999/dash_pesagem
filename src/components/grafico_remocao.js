"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts"
import { Card, CardContent, CardHeader, Box, Typography, IconButton, Tabs, Tab, alpha } from "@mui/material"
import { BarChart as BarChartIcon, ShowChart as LineChartIcon, Refresh, CalendarToday } from "@mui/icons-material"
import { Cell, Area } from "recharts"
import { getSolturasPorDiaDaSemana } from "../service/dashboard" // Import the API function

const WeekdayChart = ({ themeColors, chartsLoaded, onRefresh }) => {
  const [chartType, setChartType] = useState(0)
  const [weekdayData, setWeekdayData] = useState([])
  const [loading, setLoading] = useState(true)

  // Handle chart type change
  const handleChartTypeChange = (event, newValue) => {
    setChartType(newValue)
  }

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await getSolturasPorDiaDaSemana()

        // Transform data to match the expected format
        const formattedData = data.map((item) => ({
          day: item.dia.split("-")[0], // Get just the day name without '-feira'
          removals: item.total,
        }))

        setWeekdayData(formattedData)
        setLoading(false)
      } catch (error) {
        console.error("Erro ao carregar dados do gráfico de dias da semana:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle refresh
  const handleRefresh = async () => {
    try {
      setLoading(true)
      const data = await getSolturasPorDiaDaSemana()

      // Transform data to match the expected format
      const formattedData = data.map((item) => ({
        day: item.dia.split("-")[0], // Get just the day name without '-feira'
        removals: item.total,
      }))

      setWeekdayData(formattedData)
      setLoading(false)

      if (onRefresh) onRefresh()
    } catch (error) {
      console.error("Erro ao atualizar dados do gráfico de dias da semana:", error)
      setLoading(false)
    }
  }

  // Calculate daily average
  const dailyAverage =
    weekdayData.length > 0
      ? Math.round(weekdayData.reduce((sum, item) => sum + item.removals, 0) / weekdayData.length)
      : 0

  // Remover a seção de média diária e comparação com média do tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = weekdayData.find((item) => item.day === label)
      const removals = data?.removals || 0

      // Cores personalizadas para cada dia da semana
      const dayColors = {
        Segunda: "#FF6B6B", // vermelho coral
        Terça: "#4ECDC4", // turquesa
        Quarta: "#FFD166", // amarelo âmbar
        Quinta: "#6A0572", // roxo profundo
        Sexta: "#1A936F", // verde esmeralda
        Sábado: "#3D5A80", // azul marinho
        Domingo: "#E76F51", // laranja coral
      }

      const color = dayColors[label] || themeColors.primary.main

      return (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            border: `2px solid ${color}`,
            borderRadius: "16px",
            padding: "1.2rem",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
            maxWidth: "280px",
            position: "relative",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.7)})`,
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.2rem",
              marginBottom: "0.75rem",
              color: color,
              borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
              paddingBottom: "0.5rem",
            }}
          >
            {`${label} - ${removals} Remoções`}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "4px",
                  marginRight: "0.75rem",
                  backgroundColor: color,
                }}
              />
              <Typography sx={{ color: themeColors.text.secondary, fontWeight: 500 }}>Remoções:</Typography>
            </Box>
            <Typography sx={{ fontWeight: 600, color }}>{removals}</Typography>
          </Box>
        </Box>
      )
    }
    return null
  }

  // Render chart based on selected type
  const renderChart = () => {
    // Encontrar o dia com mais remoções para destacá-lo
    const maxRemovalsDay = [...weekdayData].sort((a, b) => b.removals - a.removals)[0]

    // Cores personalizadas para cada dia da semana
    const dayColors = {
      Segunda: "#FF6B6B", // vermelho coral
      Terça: "#4ECDC4", // turquesa
      Quarta: "#FFD166", // amarelo âmbar
      Quinta: "#6A0572", // roxo profundo
      Sexta: "#1A936F", // verde esmeralda
      Sábado: "#3D5A80", // azul marinho
      Domingo: "#E76F51", // laranja coral
    }

    // Remover a linha de referência da média no gráfico de barras
    switch (chartType) {
      case 0: // Bar Chart
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weekdayData}
              margin={{ top: 30, right: 30, left: 20, bottom: 60 }}
              barGap={12}
              barCategoryGap={40}
            >
              <defs>
                {/* Gradientes para cada dia da semana */}
                {weekdayData.map((entry) => (
                  <>
                    <linearGradient
                      key={`gradient-${entry.day}`}
                      id={`colorBar-${entry.day}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={dayColors[entry.day] || themeColors.primary.main} stopOpacity={1} />
                      <stop
                        offset="100%"
                        stopColor={dayColors[entry.day] || themeColors.primary.light}
                        stopOpacity={0.7}
                      />
                    </linearGradient>

                    <filter key={`filter-${entry.day}`} id={`glow-${entry.day}`} height="200%">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </>
                ))}
              </defs>

              <CartesianGrid vertical={false} strokeDasharray="5 5" stroke={themeColors.divider} strokeOpacity={0.4} />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={{ stroke: themeColors.divider, strokeWidth: 1 }}
                tick={{ fill: themeColors.text.primary, fontSize: 12, fontWeight: 500 }}
                dy={10}
              />

              <YAxis
                tickLine={false}
                axisLine={{ stroke: themeColors.divider, strokeWidth: 1 }}
                tick={{ fill: themeColors.text.primary, fontSize: 12, fontWeight: 500 }}
                tickFormatter={(value) => `${value}`}
                dx={-10}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(241, 245, 249, 0.5)" }} />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => <span style={{ color: themeColors.text.primary, fontWeight: 600 }}>{value}</span>}
              />

              <Bar dataKey="removals" name="Remoções" animationDuration={1500} barSize={50}>
                {weekdayData.map((entry) => (
                  <Cell
                    key={`cell-${entry.day}`}
                    fill={`url(#colorBar-${entry.day})`}
                    filter={entry.day === maxRemovalsDay?.day ? `url(#glow-${entry.day})` : undefined}
                    radius={[8, 8, 0, 0]}
                    stroke={entry.day === maxRemovalsDay?.day ? "#fff" : "none"}
                    strokeWidth={entry.day === maxRemovalsDay?.day ? 1 : 0}
                  />
                ))}
                <LabelList
                  dataKey="removals"
                  position="top"
                  fill={(entry) =>
                    entry.day === maxRemovalsDay?.day ? dayColors[entry.day] : themeColors.text.secondary
                  }
                  fontSize={12}
                  fontWeight={700}
                  formatter={(value) => `${value}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )

      // Remover a linha de referência da média no gráfico de linhas
      case 1: // Line Chart
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekdayData} margin={{ top: 30, right: 30, left: 20, bottom: 60 }}>
              <defs>
                <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={themeColors.primary.main} stopOpacity={1} />
                  <stop offset="100%" stopColor={themeColors.primary.light} stopOpacity={0.8} />
                </linearGradient>

                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={themeColors.primary.main} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={themeColors.primary.main} stopOpacity={0.05} />
                </linearGradient>

                <filter id="glow" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid strokeDasharray="5 5" stroke={themeColors.divider} strokeOpacity={0.4} vertical={false} />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={{ stroke: themeColors.divider, strokeWidth: 1 }}
                tick={{ fill: themeColors.text.primary, fontSize: 12, fontWeight: 500 }}
              />

              <YAxis
                tickLine={false}
                axisLine={{ stroke: themeColors.divider, strokeWidth: 1 }}
                tick={{ fill: themeColors.text.primary, fontSize: 12, fontWeight: 500 }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => <span style={{ color: themeColors.text.primary, fontWeight: 600 }}>{value}</span>}
              />

              <Area type="monotone" dataKey="removals" fill="url(#areaGradient)" stroke="none" fillOpacity={1} />

              <Line
                type="monotone"
                dataKey="removals"
                stroke="url(#colorLine)"
                strokeWidth={4}
                filter="url(#glow)"
                name="Remoções"
                dot={(props) => {
                  const isMax = props.payload.day === maxRemovalsDay?.day
                  return (
                    <svg>
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={isMax ? 8 : 6}
                        fill={themeColors.primary.main}
                        stroke="#fff"
                        strokeWidth={2}
                        style={{
                          filter: isMax ? "drop-shadow(0 0 4px rgba(0,0,0,0.2))" : "none",
                          animation: isMax ? "pulse 2s infinite" : "none",
                        }}
                      />
                      {isMax && (
                        <text
                          x={props.cx}
                          y={props.cy - 15}
                          textAnchor="middle"
                          fill={themeColors.primary.main}
                          fontSize={12}
                          fontWeight={700}
                        >
                          {props.payload.removals}
                        </text>
                      )}
                    </svg>
                  )
                }}
                activeDot={{
                  r: 8,
                  fill: themeColors.primary.main,
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  // Atualizar o Card e o CardHeader para um visual mais bonito
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease",
        overflow: "hidden",
        "&:hover": {
          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.12)",
          transform: "translateY(-4px)",
        },
        background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
        border: "1px solid rgba(226, 232, 240, 0.8)",
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Box
              sx={{
                width: { xs: "40px", sm: "48px" },
                height: { xs: "40px", sm: "48px" },
                borderRadius: "14px",
                background: "linear-gradient(135deg, #3a86ff 0%, #5e9bff 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: `pulse 2s ease-in-out infinite`,
                boxShadow: "0 8px 16px rgba(58, 134, 255, 0.3)",
              }}
            >
              <CalendarToday
                sx={{
                  color: "white",
                  fontSize: { xs: "1.3rem", sm: "1.5rem" },
                }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.2rem", sm: "1.4rem" },
                  color: themeColors.text.primary,
                  background: "linear-gradient(90deg, #1e293b, #334155)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Remoções por Dia da Semana
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  color: themeColors.text.secondary,
                  fontWeight: 500,
                }}
              >
                Análise de volume por dia da semana
              </Typography>
            </Box>
          </Box>
        }
        action={
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <IconButton
              onClick={handleRefresh}
              sx={{
                color: themeColors.text.secondary,
                background: alpha(themeColors.primary.main, 0.05),
                "&:hover": {
                  color: themeColors.primary.main,
                  background: alpha(themeColors.primary.main, 0.1),
                },
                transition: "all 0.2s ease",
              }}
            >
              <Refresh />
            </IconButton>
          </Box>
        }
        sx={{
          paddingBottom: "0.75rem",
          borderBottom: `1px solid ${themeColors.divider}`,
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
      <Box sx={{ padding: "0.5rem 1.5rem" }}>
        <Tabs
          value={chartType}
          onChange={handleChartTypeChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: themeColors.primary.main,
              height: "3px",
              borderRadius: "3px",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              minWidth: { xs: "80px", sm: "120px" },
              fontWeight: 500,
              color: themeColors.text.secondary,
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              "&.Mui-selected": {
                color: themeColors.primary.main,
                fontWeight: 600,
              },
              transition: "all 0.2s ease",
            },
          }}
        >
          <Tab
            icon={<BarChartIcon />}
            label="Barras"
            iconPosition="start"
            sx={{
              gap: "0.5rem",
              borderRadius: "8px",
              "&.Mui-selected": {
                background: alpha(themeColors.primary.main, 0.1),
              },
              "&:hover": {
                background: alpha(themeColors.primary.main, 0.05),
              },
            }}
          />
          <Tab
            icon={<LineChartIcon />}
            label="Linhas"
            iconPosition="start"
            sx={{
              gap: "0.5rem",
              borderRadius: "8px",
              "&.Mui-selected": {
                background: alpha(themeColors.primary.main, 0.1),
              },
              "&:hover": {
                background: alpha(themeColors.primary.main, 0.05),
              },
            }}
          />
        </Tabs>
      </Box>
      <CardContent sx={{ padding: "1.5rem" }}>
        <Box
          sx={{
            width: "100%",
            height: { xs: "350px", sm: "450px" },
            position: "relative",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(248,250,252,0.8))",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "inset 0 0 15px rgba(0,0,0,0.03)",
          }}
        >
          {!chartsLoaded || loading ? (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: alpha(themeColors.background.paper, 0.7),
                zIndex: 10,
                borderRadius: "12px",
              }}
            >
              <Box
                sx={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3a86ff 0%, #5e9bff 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  animation: `pulse 1.5s ease-in-out infinite`,
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
              }}
            >
              {weekdayData.length > 0 ? (
                renderChart()
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Typography sx={{ color: themeColors.text.secondary }}>Nenhum dado disponível</Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default WeekdayChart

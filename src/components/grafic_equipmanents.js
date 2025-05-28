"use client"

import { Card, CardContent, CardHeader, Box, Typography, IconButton, alpha, Chip } from "@mui/material"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Timeline, Refresh, TrendingUp } from "@mui/icons-material"

const WeeklyDistributionChart = ({ weeklyData, themeColors, onRefresh }) => {
  // Cores sólidas para os componentes MUI
  const solidColors = {
    carroceria: themeColors.primary.main,
    paCarregadeira: themeColors.warning.main,
    retroescavadeira: themeColors.error.main,
  }

  // Gradientes apenas para as barras do gráfico
  const gradients = [
    {
      id: "carroceriaGradient",
      color1: themeColors.primary.main,
      color2: themeColors.primary.light,
    },
    {
      id: "paCarregadeiraGradient",
      color1: themeColors.warning.main,
      color2: themeColors.warning.light,
    },
    {
      id: "retroescavadeiraGradient",
      color1: themeColors.error.main,
      color2: themeColors.error.light,
    },
  ]

  // Calculate totals for summary
  const totals = weeklyData.reduce(
    (acc, day) => ({
      carroceria: acc.carroceria + day.carroceria,
      paCarregadeira: acc.paCarregadeira + day.paCarregadeira,
      retroescavadeira: acc.retroescavadeira + day.retroescavadeira,
    }),
    { carroceria: 0, paCarregadeira: 0, retroescavadeira: 0 },
  )

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0)

      return (
        <Box
          sx={{
            backgroundColor: "white",
            border: `1px solid ${alpha(themeColors.primary.main, 0.2)}`,
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            minWidth: "200px",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              color: themeColors.text.primary,
              mb: 1.5,
              fontSize: "1rem",
              borderBottom: `2px solid ${alpha(themeColors.primary.main, 0.1)}`,
              pb: 1,
            }}
          >
            📅 {label}
          </Typography>

          <Box sx={{ mb: 1.5 }}>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: themeColors.text.secondary,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Total: {total} equipamentos
            </Typography>
          </Box>

          {payload.map((entry, index) => {
            // Usar a cor sólida correspondente ao dataKey
            const solidColor =
              entry.dataKey === "carroceria"
                ? solidColors.carroceria
                : entry.dataKey === "paCarregadeira"
                  ? solidColors.paCarregadeira
                  : solidColors.retroescavadeira

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                  p: 1,
                  borderRadius: "8px",
                  backgroundColor: alpha(solidColor, 0.05),
                  border: `1px solid ${alpha(solidColor, 0.1)}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "3px",
                      backgroundColor: solidColor,
                      boxShadow: `0 2px 8px ${alpha(solidColor, 0.3)}`,
                    }}
                  />
                  <Typography
                    sx={{
                      color: themeColors.text.primary,
                      fontSize: "0.85rem",
                      fontWeight: 500,
                    }}
                  >
                    {entry.name}
                  </Typography>
                </Box>
                <Chip
                  label={`${entry.value}`}
                  size="small"
                  sx={{
                    backgroundColor: solidColor,
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    height: "24px",
                  }}
                />
              </Box>
            )
          })}
        </Box>
      )
    }
    return null
  }

  const CustomLegend = (props) => {
    const { payload } = props

    if (!payload) return null

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mt: 2,
          flexWrap: "wrap",
        }}
      >
        {payload.map((entry, index) => {
          // Usar a cor sólida correspondente ao dataKey
          const solidColor =
            entry.dataKey === "carroceria"
              ? solidColors.carroceria
              : entry.dataKey === "paCarregadeira"
                ? solidColors.paCarregadeira
                : solidColors.retroescavadeira

          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1.5,
                borderRadius: "10px",
                backgroundColor: alpha(solidColor, 0.08),
                border: `1px solid ${alpha(solidColor, 0.2)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: alpha(solidColor, 0.15),
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 12px ${alpha(solidColor, 0.2)}`,
                },
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "4px",
                  background: `linear-gradient(135deg, ${solidColor}, ${alpha(solidColor, 0.7)})`,
                  boxShadow: `0 2px 8px ${alpha(solidColor, 0.3)}`,
                }}
              />
              <Typography
                sx={{
                  color: themeColors.text.primary,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                {entry.value}
              </Typography>
              <Chip
                label={totals[entry.dataKey]}
                size="small"
                sx={{
                  backgroundColor: solidColor,
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: "20px",
                }}
              />
            </Box>
          )
        })}
      </Box>
    )
  }

  return (
    <Card
      sx={{
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        transition: "all 0.4s ease",
        overflow: "hidden",
        "&:hover": {
          boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15)",
          transform: "translateY(-4px)",
        },
        background: `linear-gradient(135deg, ${themeColors.background.card} 0%, ${alpha(themeColors.primary.main, 0.02)} 100%)`,
        mb: 4,
        border: `1px solid ${alpha(themeColors.primary.main, 0.08)}`,
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Box
              sx={{
                width: { xs: "40px", sm: "48px" },
                height: { xs: "40px", sm: "48px" },
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${themeColors.info.main}, ${themeColors.info.light})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 24px ${alpha(themeColors.info.main, 0.3)}`,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: "-2px",
                  borderRadius: "18px",
                  background: `linear-gradient(135deg, ${themeColors.info.light}, ${themeColors.info.main})`,
                  zIndex: -1,
                  opacity: 0.3,
                },
              }}
            >
              <Timeline
                sx={{
                  color: "white",
                  fontSize: { xs: "1.3rem", sm: "1.5rem" },
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.2rem", sm: "1.4rem" },
                  color: themeColors.text.primary,
                  background: `linear-gradient(135deg, ${themeColors.text.primary}, ${themeColors.info.main})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Distribuição Semanal por Tipo
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <TrendingUp
                  sx={{
                    fontSize: "1rem",
                    color: themeColors.success.main,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    color: themeColors.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  Análise de utilização semanal de equipamentos
                </Typography>
              </Box>
            </Box>
          </Box>
        }
        action={
          <IconButton
            sx={{
              color: themeColors.text.secondary,
              backgroundColor: alpha(themeColors.info.main, 0.08),
              borderRadius: "12px",
              "&:hover": {
                color: themeColors.info.main,
                backgroundColor: alpha(themeColors.info.main, 0.15),
                transform: "rotate(180deg)",
              },
              transition: "all 0.3s ease",
            }}
            onClick={onRefresh}
          >
            <Refresh />
          </IconButton>
        }
        sx={{
          paddingBottom: "1rem",
          borderBottom: `2px solid ${alpha(themeColors.primary.main, 0.08)}`,
          "& .MuiCardHeader-action": {
            margin: 0,
          },
        }}
      />
      <CardContent sx={{ padding: "2rem" }}>
        <Box
          sx={{
            width: "100%",
            height: "450px",
            position: "relative",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{
                top: 30,
                right: 30,
                left: 20,
                bottom: 20,
              }}
              barCategoryGap="20%"
            >
              <defs>
                {gradients.map((gradient) => (
                  <linearGradient key={gradient.id} id={gradient.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={gradient.color1} stopOpacity={1} />
                    <stop offset="100%" stopColor={gradient.color2} stopOpacity={0.8} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke={alpha(themeColors.text.secondary, 0.15)} vertical={false} />

              <XAxis
                dataKey="day"
                tick={{
                  fill: themeColors.text.secondary,
                  fontSize: 13,
                  fontWeight: 500,
                }}
                axisLine={{
                  stroke: alpha(themeColors.text.secondary, 0.2),
                  strokeWidth: 2,
                }}
                tickLine={false}
                dy={10}
              />

              <YAxis
                tick={{
                  fill: themeColors.text.secondary,
                  fontSize: 12,
                  fontWeight: 500,
                }}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: alpha(themeColors.primary.main, 0.05) }} />

              <Legend content={<CustomLegend />} />

              <Bar
                dataKey="carroceria"
                name="Carroceria"
                fill={`url(#carroceriaGradient)`}
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              />

              <Bar
                dataKey="paCarregadeira"
                name="Pá Carregadeira"
                fill={`url(#paCarregadeiraGradient)`}
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              />

              <Bar
                dataKey="retroescavadeira"
                name="Retroescavadeira"
                fill={`url(#retroescavadeiraGradient)`}
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export default WeeklyDistributionChart

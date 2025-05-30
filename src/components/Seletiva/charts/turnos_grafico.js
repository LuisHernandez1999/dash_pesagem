"use client"

import { useState, useEffect } from "react"
import { Box, Typography, alpha, useTheme, CircularProgress } from "@mui/material"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { WbSunny, NightsStay, WbTwilight } from "@mui/icons-material"

const RegionDistributionChart = ({ themeColors, chartsLoaded, dashboardData }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)
  const theme = useTheme()

  // Function to map shift names to icons and colors
  const getShiftIcon = (shiftName) => {
    const lowerCaseShift = shiftName.toLowerCase()
    if (lowerCaseShift.includes("diurno") || lowerCaseShift.includes("manhã") || lowerCaseShift.includes("matutino")) {
      return { icon: <WbSunny />, color: themeColors.warning.main }
    } else if (lowerCaseShift.includes("vespertino") || lowerCaseShift.includes("tarde")) {
      return { icon: <WbTwilight />, color: themeColors.primary.main }
    } else if (lowerCaseShift.includes("noturno") || lowerCaseShift.includes("noite")) {
      return { icon: <NightsStay />, color: themeColors.info.main }
    } else {
      // Default for unknown shifts
      return { icon: <WbSunny />, color: themeColors.secondary.main }
    }
  }

  // Process dashboard data when it changes
  useEffect(() => {
    console.log("RegionDistributionChart recebeu dashboardData:", dashboardData)

    if (dashboardData && dashboardData.por_turno) {
      console.log("Dados por_turno:", dashboardData.por_turno)

      const turnoData = dashboardData.por_turno

      // Map the API response to our component's data format
      const chartData = []

      Object.keys(turnoData).forEach((turnoKey) => {
        const turno = turnoData[turnoKey]
        const { icon, color } = getShiftIcon(turnoKey)

        // Clean up the shift name for display
        const displayName = turnoKey.replace("Equipe(", "").replace(")", "")

        chartData.push({
          name: displayName,
          motoristas: turno.motoristas || 0,
          coletores: turno.coletores || 0,
          total: (turno.motoristas || 0) + (turno.coletores || 0),
          icon: icon,
          color: color,
        })
      })

      setData(chartData)
      setLoading(false)
      setError(null)
    } else if (dashboardData === null) {
      setLoading(true)
    } else {
      setError("Dados não disponíveis")
      setLoading(false)
    }
  }, [dashboardData, themeColors])

  const handleMouseEnter = (_, index) => {
    setActiveIndex(index)
  }

  const handleMouseLeave = () => {
    setActiveIndex(null)
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const shiftData = payload[0].payload
      return (
        <Box
          sx={{
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            border: `1px solid ${alpha(shiftData.color, 0.2)}`,
            minWidth: "220px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                backgroundColor: alpha(shiftData.color, 0.15),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: shiftData.color,
              }}
            >
              {shiftData.icon}
            </Box>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 700,
                color: themeColors.text.primary,
                borderBottom: `2px solid ${shiftData.color}`,
                paddingBottom: "4px",
              }}
            >
              Turno {shiftData.name}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: themeColors.text.primary }}>
                Motoristas:
              </Typography>
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: shiftData.color }}>
                {shiftData.motoristas} profissionais
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: themeColors.text.primary }}>
                Coletores:
              </Typography>
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: shiftData.color }}>
                {shiftData.coletores} profissionais
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px dashed ${alpha(themeColors.text.secondary, 0.2)}` }}>
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: shiftData.color,
                textAlign: "center",
              }}
            >
              Total: {shiftData.total} profissionais
            </Typography>
          </Box>
        </Box>
      )
    }
    return null
  }

  // Calculate total professionals
  const totalProfessionals = data.reduce((sum, item) => sum + item.total, 0)

  // Custom legend
  const renderLegend = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          mt: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              background: "linear-gradient(90deg, rgba(0,0,0,0.7), rgba(0,0,0,0.7))",
              borderRadius: 1,
            }}
          />
          <Typography sx={{ fontSize: "0.875rem", color: themeColors.text.secondary }}>Motoristas</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              background: "linear-gradient(90deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3))",
              borderRadius: 1,
            }}
          />
          <Typography sx={{ fontSize: "0.875rem", color: themeColors.text.secondary }}>Coletores</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "300px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {loading ? (
        <Box
          sx={{
            width: "100%",
            height: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={40} sx={{ color: themeColors.primary.main }} />
        </Box>
      ) : error ? (
        <Box
          sx={{
            width: "100%",
            height: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography sx={{ color: themeColors.error.main, fontWeight: 500 }}>
            Erro ao carregar dados do gráfico
          </Typography>
          <Typography variant="body2" sx={{ color: themeColors.text.secondary }}>
            {error}
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: themeColors.text.primary,
                textAlign: "center",
              }}
            >
              Total de Profissionais: {totalProfessionals}
            </Typography>
          </Box>

          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                barGap={0}
                barCategoryGap={20}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, "dataMax"]} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={(props) => {
                    const { x, y, payload } = props
                    const shiftInfo = data.find((item) => item.name === payload.value)

                    return (
                      <g transform={`translate(${x},${y})`}>
                        <foreignObject x="-80" y="-20" width="80" height="40">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              height: "100%",
                              width: "100%",
                            }}
                          >
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: "6px",
                                backgroundColor: alpha(shiftInfo.color, 0.15),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: shiftInfo.color,
                              }}
                            >
                              {shiftInfo.icon}
                            </Box>
                            <Typography
                              sx={{
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                color: themeColors.text.primary,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {payload.value}
                            </Typography>
                          </Box>
                        </foreignObject>
                      </g>
                    )
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} />
                <Bar
                  dataKey="motoristas"
                  name="Motoristas"
                  stackId="a"
                  radius={[0, 0, 0, 0]}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  animationDuration={1500}
                  animationBegin={200}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`motoristas-${index}`}
                      fill={entry.color}
                      fillOpacity={activeIndex === index ? 0.9 : 0.7}
                      stroke={entry.color}
                      strokeWidth={activeIndex === index ? 1 : 0}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="coletores"
                  name="Coletores"
                  stackId="a"
                  radius={[0, 4, 4, 0]}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  animationDuration={1500}
                  animationBegin={400}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`coletores-${index}`}
                      fill={entry.color}
                      fillOpacity={activeIndex === index ? 0.5 : 0.3}
                      stroke={entry.color}
                      strokeWidth={activeIndex === index ? 1 : 0}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>

          {/* Shift details cards */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              mt: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {data.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor: alpha(item.color, 0.05),
                  border: `1px solid ${alpha(item.color, 0.1)}`,
                  minWidth: "150px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: `0 5px 15px ${alpha(item.color, 0.2)}`,
                    backgroundColor: alpha(item.color, 0.08),
                  },
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: alpha(item.color, 0.2),
                    color: item.color,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: item.color }}>{item.name}</Typography>
                <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{ fontSize: "0.7rem", color: themeColors.text.secondary, textTransform: "uppercase" }}
                    >
                      Motoristas
                    </Typography>
                    <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: item.color }}>
                      {item.motoristas}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{ fontSize: "0.7rem", color: themeColors.text.secondary, textTransform: "uppercase" }}
                    >
                      Coletores
                    </Typography>
                    <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: item.color }}>
                      {item.coletores}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: themeColors.text.secondary,
                    mt: 1,
                    textAlign: "center",
                  }}
                >
                  Total: <span style={{ color: item.color }}>{item.total}</span> profissionais
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  )
}

export default RegionDistributionChart

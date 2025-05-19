"use client"

import { useState, useEffect } from "react"
import { Box, Typography, alpha, Skeleton, useTheme } from "@mui/material"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  LabelList,
} from "recharts"
import { WbSunny, NightsStay, WbTwilight } from "@mui/icons-material"
import { contarColetoresMotoristasPorTurno } from "../../../service/seletiva"

const GraficoTurnos = ({ themeColors, chartsLoaded }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const theme = useTheme()

  // Function to map shift names to icons and colors
  const getShiftIcon = (shiftName) => {
    const lowerCaseShift = shiftName.toLowerCase()
    if (lowerCaseShift.includes("matutino") || lowerCaseShift.includes("manhã")) {
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

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await contarColetoresMotoristasPorTurno()

      if (response.success) {
        // Map API data to the format needed by the chart
        const chartData = response.data.map((item) => {
          const { icon, color } = getShiftIcon(item.equipe)
          return {
            name: item.equipe,
            motoristas: item.motoristas,
            coletores: item.coletores,
            total: item.motoristas + item.coletores, // Add total for the label
            icon: icon,
            color: color,
          }
        })

        setData(chartData)
        setError(null)
      } else {
        console.error("Erro ao carregar dados de turnos:", response.error)
        setError(response.error || "Erro ao carregar dados")
      }
    } catch (err) {
      console.error("Erro ao carregar dados de turnos:", err)
      setError("Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    // Set up refresh interval (8 minutes)
    const refreshInterval = setInterval(
      () => {
        loadData()
      },
      8 * 60 * 1000,
    )

    return () => clearInterval(refreshInterval)
  }, [themeColors])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const turnoData = data.find((item) => item.name === label)

      return (
        <Box
          sx={{
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            border: `1px solid ${alpha(turnoData?.color || themeColors.primary.main, 0.2)}`,
            minWidth: "200px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                backgroundColor: alpha(turnoData?.color || themeColors.primary.main, 0.15),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: turnoData?.color || themeColors.primary.main,
              }}
            >
              {turnoData?.icon || <WbSunny />}
            </Box>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 700,
                color: themeColors.text.primary,
                borderBottom: `2px solid ${turnoData?.color || themeColors.primary.main}`,
                paddingBottom: "4px",
              }}
            >
              Turno {label}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {payload.map((entry, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: entry.color,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: themeColors.text.primary,
                    }}
                  >
                    {entry.name === "motoristas" ? "Motoristas" : "Coletores"}:
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: entry.color,
                  }}
                >
                  {entry.value} profissionais
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px dashed ${alpha(themeColors.text.secondary, 0.2)}` }}>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: themeColors.text.secondary,
                textAlign: "center",
              }}
            >
              Total: {payload.reduce((sum, entry) => sum + entry.value, 0)} profissionais
            </Typography>
          </Box>
        </Box>
      )
    }
    return null
  }

  const CustomizedAxisTick = (props) => {
    const { x, y, payload, dataKey } = props
    const turnoData = data.find((item) => item.name === payload.value)

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill={themeColors.text.primary} fontWeight={600} fontSize="12">
          {payload.value}
        </text>
        {turnoData && (
          <foreignObject x={-12} y={20} width={24} height={24} style={{ overflow: "visible", textAlign: "center" }}>
            <Box
              sx={{
                color: turnoData.color,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {turnoData.icon}
            </Box>
          </foreignObject>
        )}
      </g>
    )
  }

  // Custom label component for the motoristas values
  const renderCustomMotoristaLabel = (props) => {
    const { x, y, width, height, value } = props
    return (
      <g>
        <text
          x={x + width / 2}
          y={y + height / 2}
          fill="#FFFFFF"
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight="bold"
          fontSize="12"
        >
          {value}
        </text>
      </g>
    )
  }

  // Custom label component for the coletores values
  const renderCustomColetorLabel = (props) => {
    const { x, y, width, height, value } = props
    return (
      <g>
        <text
          x={x + width / 2}
          y={y + height / 2}
          fill="#000000"
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight="bold"
          fontSize="12"
        >
          {value}
        </text>
      </g>
    )
  }

  // Custom label component for the total values
  const renderCustomTotalLabel = (props) => {
    const { x, y, width, height, value, index } = props
    const entry = data[index]

    // Calculate the position for the total label
    // We want it to be in the middle of the stacked bar
    const barHeight = entry.motoristas + entry.coletores
    const yPosition = y + height / 2

    return (
      <g>
        <rect
          x={x + width / 2 - 20}
          y={yPosition - 10}
          width={40}
          height={20}
          fill="rgba(255, 255, 255, 0.8)"
          rx={4}
          ry={4}
        />
        <text
          x={x + width / 2}
          y={yPosition}
          fill={entry.color}
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight="bold"
          fontSize="14"
        >
          {value}
        </text>
      </g>
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
        justifyContent: "center",
        alignItems: "center",
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
          <Skeleton
            variant="rectangular"
            width="100%"
            height={250}
            sx={{ bgcolor: alpha(themeColors.text.primary, 0.1), borderRadius: "8px" }}
          />
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 40,
              }}
              barGap={8}
              barSize={32}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(themeColors.text.primary, 0.1)} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={<CustomizedAxisTick />} height={60} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: themeColors.text.secondary, fontSize: 12 }}
                label={{
                  value: "Quantidade de Profissionais",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fill: themeColors.text.secondary, fontSize: 12 },
                }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: alpha(themeColors.primary.main, 0.05) }} />
              <Legend
                wrapperStyle={{ paddingTop: 15 }}
                formatter={(value, entry, index) => (
                  <span style={{ color: themeColors.text.primary, fontWeight: 500, fontSize: "0.875rem" }}>
                    {value === "motoristas" ? "Motoristas" : "Coletores"}
                  </span>
                )}
              />
              <Bar
                dataKey="motoristas"
                name="motoristas"
                stackId="a"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={300}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-motoristas-${index}`} fill={entry.color} stroke={entry.color} strokeWidth={1} />
                ))}
                <LabelList dataKey="motoristas" content={renderCustomMotoristaLabel} />
              </Bar>
              <Bar
                dataKey="coletores"
                name="coletores"
                stackId="a"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={600}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-coletores-${index}`}
                    fill={alpha(entry.color, 0.3)}
                    stroke={entry.color}
                    strokeWidth={1}
                  />
                ))}
                <LabelList dataKey="coletores" content={renderCustomColetorLabel} />
              </Bar>
              <Bar dataKey="total" name="total" stackId="b" fill="transparent" stroke="transparent">
                <LabelList dataKey="total" content={renderCustomTotalLabel} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legenda de turnos */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              mt: 2,
              flexWrap: "wrap",
            }}
          >
            {data.map((turno, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "6px",
                    backgroundColor: alpha(turno.color, 0.15),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: turno.color,
                  }}
                >
                  {turno.icon}
                </Box>
                <Typography sx={{ fontSize: "0.8rem", color: themeColors.text.secondary, fontWeight: 500 }}>
                  {turno.name}: {turno.motoristas + turno.coletores} profissionais
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  )
}

export default GraficoTurnos

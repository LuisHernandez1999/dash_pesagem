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

const GraficoTurnos = ({ themeColors, chartsLoaded }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const theme = useTheme()

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const mockData = [
        {
          name: "Matutino",
          motoristas: 18,
          coletores: 42,
          icon: <WbSunny />,
          color: themeColors.warning.main,
        },
        {
          name: "Vespertino",
          motoristas: 15,
          coletores: 36,
          icon: <WbTwilight />,
          color: themeColors.primary.main,
        },
        {
          name: "Noturno",
          motoristas: 12,
          coletores: 28,
          icon: <NightsStay />,
          color: themeColors.info.main,
        },
      ]
      setData(mockData)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
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

  const CustomizedLabel = (props) => {
    const { x, y, width, height, value, fill } = props
    return (
      <text
        x={x + width / 2}
        y={y + height / 2 - 12}
        fill={typeof fill === "string" ? alpha(fill, 0.9) : "#ffffff"}
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
        fontSize="14"
      >
        {value}
      </text>
    )
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
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={300}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-motoristas-${index}`} fill={entry.color} stroke={entry.color} strokeWidth={1} />
                ))}
                <LabelList dataKey="motoristas" content={<CustomizedLabel />} />
              </Bar>
              <Bar
                dataKey="coletores"
                name="coletores"
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
                <LabelList dataKey="coletores" content={<CustomizedLabel />} />
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

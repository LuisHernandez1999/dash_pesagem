"use client"

import { useState, useEffect } from "react"
import { Box, Typography, alpha, Skeleton, useTheme } from "@mui/material"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ZAxis,
  Cell,
  ReferenceLine,
} from "recharts"

const GraficoSeletivaSemanal = ({ themeColors, chartsLoaded }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const theme = useTheme()

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const mockData = [
        { dia: "Segunda", coletas: 42, eficiencia: 85 },
        { dia: "Terça", coletas: 38, eficiencia: 82 },
        { dia: "Quarta", coletas: 45, eficiencia: 88 },
        { dia: "Quinta", coletas: 40, eficiencia: 84 },
        { dia: "Sexta", coletas: 50, eficiencia: 90 },
        { dia: "Sábado", coletas: 25, eficiencia: 75 },
        { dia: "Domingo", coletas: 15, eficiencia: 70 },
      ]
      setData(mockData)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [themeColors])

  // Calculate average
  const average = data.length > 0 ? data.reduce((acc, curr) => acc + curr.coletas, 0) / data.length : 0

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <Box
          sx={{
            backgroundColor: "white",
            padding: "12px 16px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            border: `1px solid ${themeColors.divider}`,
            minWidth: "180px",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: themeColors.text.primary,
              mb: 1,
              borderBottom: `2px solid ${themeColors.primary.main}`,
              paddingBottom: "4px",
            }}
          >
            {data.dia}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: getColorByEfficiency(data.eficiencia),
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: themeColors.text.primary,
                }}
              >
                Coletas: {data.coletas}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: getColorByEfficiency(data.eficiencia),
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: themeColors.text.primary,
                }}
              >
                Eficiência: {data.eficiencia}%
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    }
    return null
  }

  const getColorByEfficiency = (efficiency) => {
    if (efficiency >= 85) return themeColors.success.main
    if (efficiency >= 75) return themeColors.warning.main
    return themeColors.error.main
  }

  const getDotSize = (coletas) => {
    const baseSize = 1200
    return Math.max(baseSize / 20, Math.min(baseSize / 10, coletas * 3))
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "350px",
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
            height: "350px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height={300}
            sx={{ bgcolor: alpha(themeColors.text.primary, 0.1), borderRadius: "8px" }}
          />
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart
            margin={{
              top: 20,
              right: 30,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={alpha(themeColors.text.primary, 0.1)} />
            <XAxis
              dataKey="dia"
              name="Dia"
              axisLine={false}
              tickLine={false}
              tick={{ fill: themeColors.text.secondary, fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              dataKey="coletas"
              name="Coletas"
              axisLine={false}
              tickLine={false}
              tick={{ fill: themeColors.text.secondary, fontSize: 12 }}
              domain={[0, "dataMax + 10"]}
              label={{
                value: "Quantidade de Coletas",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: themeColors.text.secondary, fontSize: 12 },
              }}
            />
            <ZAxis dataKey="eficiencia" range={[100, 1000]} name="Eficiência" unit="%" />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
            <Legend
              wrapperStyle={{ paddingTop: 15 }}
              formatter={(value, entry, index) => (
                <span style={{ color: themeColors.text.primary, fontWeight: 500, fontSize: "0.875rem" }}>
                  Coletas Seletivas
                </span>
              )}
            />
            <ReferenceLine
              y={average}
              stroke={themeColors.info.main}
              strokeDasharray="3 3"
              label={{
                value: `Média: ${average.toFixed(0)} coletas`,
                position: "right",
                fill: themeColors.info.main,
                fontSize: 12,
              }}
            />
            <Scatter
              name="Coletas Seletivas"
              data={data}
              fill={themeColors.primary.main}
              animationDuration={1500}
              animationBegin={300}
              shape="circle"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColorByEfficiency(entry.eficiencia)}
                  stroke={alpha(getColorByEfficiency(entry.eficiencia), 0.8)}
                  strokeWidth={2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      )}

      {/* Legenda de eficiência */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mt: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: themeColors.success.main,
            }}
          />
          <Typography sx={{ fontSize: "0.75rem", color: themeColors.text.secondary }}>
            Alta Eficiência (≥85%)
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: themeColors.warning.main,
            }}
          />
          <Typography sx={{ fontSize: "0.75rem", color: themeColors.text.secondary }}>
            Média Eficiência (75-84%)
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: themeColors.error.main,
            }}
          />
          <Typography sx={{ fontSize: "0.75rem", color: themeColors.text.secondary }}>
            Baixa Eficiência (≤74%)
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default GraficoSeletivaSemanal

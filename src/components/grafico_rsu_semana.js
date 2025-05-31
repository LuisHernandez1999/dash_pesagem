"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Box, Typography, Chip, CircularProgress } from "@mui/material"
import { TrendingUp } from "@mui/icons-material"

// Mapeamento de dias da semana
const dayMapping = {
  Domingo: "Dom",
  "Segunda-feira": "Seg",
  "Terça-feira": "Ter",
  "Quarta-feira": "Qua",
  "Quinta-feira": "Qui",
  "Sexta-feira": "Sex",
  Sábado: "Sáb",
}

// Cores simplificadas para cada dia
const dayColors = {
  Dom: "#F94144",
  Seg: "#4361EE",
  Ter: "#4CC9F0",
  Qua: "#F72585",
  Qui: "#7209B7",
  Sex: "#F9C74F",
  Sáb: "#90BE6D",
}

const WeeklyDistributionChart = ({ data = [], loading = false, height = 300, showLegend = true }) => {
  const [activeBar, setActiveBar] = useState(null)

  // Processar dados
  const processData = (inputData) => {
    if (!inputData || (Array.isArray(inputData) && inputData.length === 0)) {
      return []
    }

    let formattedData = []

    if (Array.isArray(inputData)) {
      formattedData = inputData.map((item) => ({
        day: dayMapping[item.diaSemana] || item.diaSemana?.substring(0, 3) || "N/A",
        value: Number(item.quantidade) || 0,
        fullDayName: item.diaSemana || "Não informado",
        fill: dayColors[dayMapping[item.diaSemana]] || "#4361EE",
      }))
    } else if (typeof inputData === "object") {
      formattedData = Object.entries(inputData).map(([diaSemana, quantidade]) => ({
        day: dayMapping[diaSemana] || diaSemana?.substring(0, 3) || "N/A",
        value: Number(quantidade) || 0,
        fullDayName: diaSemana || "Não informado",
        fill: dayColors[dayMapping[diaSemana]] || "#4361EE",
      }))
    }

    // Ordenar dias da semana
    const dayOrder = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    return formattedData.sort((a, b) => {
      const indexA = dayOrder.indexOf(a.day)
      const indexB = dayOrder.indexOf(b.day)
      return indexA - indexB
    })
  }

  const chartData = processData(data)
  const values = chartData.map((item) => item.value)
  const average = values.length > 0 ? values.reduce((acc, val) => acc + val, 0) / values.length : 0

  // Tooltip customizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            padding: "12px",
            border: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <Typography sx={{ fontWeight: 600, color: data.fill, mb: 0.5 }}>{data.fullDayName}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: data.fill,
              }}
            />
            <Typography sx={{ fontWeight: 700 }}>{data.value} saídas</Typography>
          </Box>
          {average > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mt: 0.5,
                fontSize: "0.8rem",
                color: data.value > average ? "#4caf50" : "#f44336",
              }}
            >
              <TrendingUp fontSize="small" sx={{ transform: data.value <= average ? "rotate(180deg)" : "none" }} />
              <Typography variant="caption">
                {data.value > average
                  ? `${Math.round((data.value / average - 1) * 100)}% acima da média`
                  : `${Math.round((1 - data.value / average) * 100)}% abaixo da média`}
              </Typography>
            </Box>
          )}
        </Box>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: height,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="textSecondary">
          Carregando dados do gráfico...
        </Typography>
      </Box>
    )
  }

  if (chartData.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: height,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Nenhum dado disponível
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Aguardando dados da API...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ width: "100%", height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            onMouseEnter={(data, index) => setActiveBar(index)}
            onMouseLeave={() => setActiveBar(null)}
            barCategoryGap="40%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#666" }} />
            <Tooltip content={<CustomTooltip />} />
            {average > 0 && (
              <ReferenceLine
                y={average}
                stroke="#757575"
                strokeDasharray="5 3"
                label={{ value: `Média: ${average.toFixed(1)}`, position: "right" }}
              />
            )}
            <Bar 
              dataKey="value" 
              radius={[8, 8, 0, 0]} 
              stroke="rgba(255,255,255,0.8)" 
              strokeWidth={1} 
              maxBarSize={35}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {showLegend && chartData.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 1.5,
            gap: 1,
            flexWrap: "wrap",
            padding: "6px 12px",
            borderRadius: "8px",
            backgroundColor: "rgba(0,0,0,0.02)",
          }}
        >
          {average > 0 && (
            <Chip
              label={`Média: ${average.toFixed(1)}`}
              size="small"
              sx={{
                backgroundColor: "rgba(117, 117, 117, 0.1)",
                color: "#757575",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
          )}

          {chartData.map((item, index) => (
            <Chip
              key={item.day}
              icon={
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "2px",
                    backgroundColor: item.fill,
                  }}
                />
              }
              label={item.fullDayName}
              size="small"
              onClick={() => setActiveBar(activeBar === index ? null : index)}
              sx={{
                backgroundColor: `${item.fill}15`,
                color: item.fill,
                fontWeight: 600,
                fontSize: "0.75rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: `${item.fill}25`,
                  transform: "translateY(-1px)",
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default WeeklyDistributionChart
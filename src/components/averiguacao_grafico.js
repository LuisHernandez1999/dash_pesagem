"use client"

import { useState, useEffect, useRef } from "react"
import { Box, Typography, alpha } from "@mui/material"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
  ReferenceLine,
} from "recharts"

// Componente de tooltip elegante e moderno - CORRIGIDO
const CustomTooltip = ({ active, payload, label }) => {
  // Verificação mais robusta para evitar erros de propriedades indefinidas
  if (active && payload && payload.length > 0 && payload[0] && payload[0].color) {
    return (
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          padding: "20px",
          border: "none",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          minWidth: "220px",
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: `linear-gradient(90deg, ${payload[0].color}, ${alpha(payload[0].color, 0.6)})`,
            borderRadius: "20px 20px 0 0",
          },
        }}
      >
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#333",
            marginBottom: "16px",
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          {label}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 1 }}>
          <Box
            sx={{
              width: "50px",
              height: "50px",
              borderRadius: "15px",
              background: `linear-gradient(135deg, ${payload[0].color}, ${alpha(payload[0].color, 0.7)})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 8px 20px ${alpha(payload[0].color, 0.25)}`,
            }}
          >
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#fff",
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              {Math.round((payload[0].value / 8) * 100)}%
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: 800,
                color: payload[0].color,
                fontFamily: "'Montserrat', sans-serif",
                lineHeight: 1,
                letterSpacing: "-0.5px",
                textShadow: `0 2px 10px ${alpha(payload[0].color, 0.15)}`,
              }}
            >
              {payload[0].value.toLocaleString()}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#666",
                mt: 0.5,
                fontWeight: 500,
              }}
            >
              Averiguações
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }
  return null
}

// Componente principal
const PremiumChartComponent = ({ data, loading = false }) => {
  const chartRef = useRef(null)
  const [animatedData, setAnimatedData] = useState(data || []) // Garantir que data nunca seja undefined
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [chartWidth, setChartWidth] = useState(0)
  const [chartHeight, setChartHeight] = useState(0)

  // Efeito para atualizar os dados animados quando os dados mudam
  useEffect(() => {
    if (data) {
      setAnimatedData(data)
    }
  }, [data])

  // Efeito para obter dimensões do gráfico
  useEffect(() => {
    if (chartRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setChartWidth(entry.contentRect.width)
          setChartHeight(entry.contentRect.height)
        }
      })

      resizeObserver.observe(chartRef.current)
      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [])

  // Verificar se temos dados válidos
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "700px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "30px",
          background: "#FFFFFF",
          boxShadow: "0 20px 80px rgba(0, 0, 0, 0.07)",
        }}
      >
        <Typography sx={{ fontSize: "18px", color: "#666" }}>Nenhum dado disponível para exibição</Typography>
      </Box>
    )
  }

  // Preparar dados para o gráfico de barras
  const barData = animatedData.map((item) => ({
    name: item.name,
    value: item.value,
    color: item.color,
  }))

  // Preparar dados para o gráfico de pizza
  const pieData = animatedData.map((item) => ({
    name: item.name,
    value: item.value,
    color: item.color,
  }))

  // Calcular valor total
  const totalValue = animatedData.reduce((sum, item) => sum + item.value, 0)

  // Calcular valor máximo para o eixo Y
  const maxValue = Math.max(...animatedData.map((item) => item.value)) * 1.2

  // Calcular valor médio
  const avgValue = totalValue / animatedData.length

  // Manipuladores de eventos
  const handleMouseEnter = (_, index) => {
    setSelectedIndex(index)
  }

  const handleMouseLeave = () => {
    setSelectedIndex(null)
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "700px",
        position: "relative",
        borderRadius: "30px",
        overflow: "hidden",
        background: "#FFFFFF",
        boxShadow: "0 20px 80px rgba(0, 0, 0, 0.07)",
        padding: "30px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Cabeçalho - Apenas o indicador de total */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 4,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Indicador de total */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              padding: "16px 24px",
              borderRadius: "20px",
              background: "rgba(250, 250, 250, 0.8)",
              border: "1px solid rgba(230, 235, 240, 1)",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.05)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#333",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Total
            </Typography>
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: 800,
                color: "#1976d2",
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: "-0.5px",
                textShadow: "0 2px 10px rgba(25, 118, 210, 0.15)",
              }}
            >
              {totalValue.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {!loading ? (
        <Box
          sx={{
            display: "flex",
            flex: 1,
            position: "relative",
            zIndex: 2,
            background: "#FFFFFF",
            borderRadius: "24px",
            padding: "25px",
            border: "1px solid rgba(230, 235, 240, 0.5)",
            boxShadow: "inset 0 0 60px rgba(0, 0, 0, 0.02)",
          }}
          ref={chartRef}
        >
          {/* Gráfico de barras elegante */}
          <Box
            sx={{
              width: "70%",
              height: "100%",
              position: "relative",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 30, right: 30, left: 20, bottom: 30 }}
                onMouseMove={(e) => {
                  if (e && e.activeTooltipIndex !== undefined) {
                    handleMouseEnter(e, e.activeTooltipIndex)
                  }
                }}
                onMouseLeave={handleMouseLeave}
                barGap={8}
                barSize={36}
              >
                <defs>
                  {barData.map((entry, index) => (
                    <linearGradient
                      key={`barGradient-${index}`}
                      id={`barGradient-${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={alpha(entry.color, 0.7)} stopOpacity={1} />
                    </linearGradient>
                  ))}
                </defs>

                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(0, 0, 0, 0.04)" strokeWidth={1} />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "#555",
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                  }}
                  axisLine={{ stroke: "rgba(0, 0, 0, 0.05)", strokeWidth: 1 }}
                  tickLine={false}
                  dy={12}
                />

                <YAxis
                  tick={{
                    fill: "#555",
                    fontSize: 12,
                    fontFamily: "'Inter', sans-serif",
                  }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                  tickFormatter={(value) => value.toLocaleString()}
                  domain={[0, maxValue]}
                  allowDecimals={false}
                />

                <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0.15 }} />

                {/* Linha de referência para média */}
                <ReferenceLine
                  y={avgValue}
                  stroke="#1976d2"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: "Média",
                    position: "right",
                    fill: "#1976d2",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                />

                <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1500} animationEasing="ease-out">
                  {barData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#barGradient-${index})`}
                      cursor="pointer"
                      style={{
                        filter:
                          selectedIndex === index
                            ? `drop-shadow(0 10px 15px ${alpha(entry.color, 0.3)})`
                            : `drop-shadow(0 5px 8px ${alpha(entry.color, 0.15)})`,
                        transition: "all 0.3s ease",
                        transform: selectedIndex === index ? "scaleY(1.05)" : "scaleY(1)",
                        transformOrigin: "bottom",
                      }}
                    />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(value) => value.toLocaleString()}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      fill: "#555",
                      textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                    }}
                    offset={10}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>

          {/* Gráfico de pizza lateral aprimorado */}
          <Box
            sx={{
              width: "30%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "60%",
                position: "relative",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {pieData.map((entry, index) => (
                      <linearGradient
                        key={`pieGradient-${index}`}
                        id={`pieGradient-${index}`}
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={alpha(entry.color, 1)} />
                        <stop offset="100%" stopColor={alpha(entry.color, 0.7)} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="85%"
                    paddingAngle={3}
                    dataKey="value"
                    onMouseEnter={(_, index) => handleMouseEnter(null, index)}
                    onMouseLeave={handleMouseLeave}
                    animationDuration={1500}
                    animationEasing="ease-out"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#pieGradient-${index})`}
                        stroke={alpha(entry.color, 0.2)}
                        strokeWidth={selectedIndex === index ? 3 : 1}
                        style={{
                          filter:
                            selectedIndex === index
                              ? `drop-shadow(0 0 15px ${alpha(entry.color, 0.5)})`
                              : `drop-shadow(0 0 8px ${alpha(entry.color, 0.2)})`,
                          transition: "all 0.3s ease",
                          transform: selectedIndex === index ? "scale(1.05)" : "scale(1)",
                          transformOrigin: "center",
                        }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Círculo central com efeito de vidro aprimorado */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(230, 235, 240, 1)",
                  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translate(-50%, -50%) scale(1.05)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#333",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Média
                </Typography>
                <Typography
                  sx={{
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "#1976d2",
                    fontFamily: "'Montserrat', sans-serif",
                    letterSpacing: "-0.5px",
                    textShadow: "0 2px 10px rgba(25, 118, 210, 0.15)",
                  }}
                >
                  {Math.round(totalValue / animatedData.length).toLocaleString()}
                </Typography>
              </Box>
            </Box>

            {/* Legenda aprimorada */}
            <Box
              sx={{
                width: "100%",
                mt: 4,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                maxHeight: "40%",
                overflowY: "auto",
                pr: 1,
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "rgba(0, 0, 0, 0.03)",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(25, 118, 210, 0.1)",
                  borderRadius: "10px",
                },
              }}
            >
              {pieData.map((entry, index) => (
                <Box
                  key={`legend-${index}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: alpha(entry.color, 0.05),
                    border: `1px solid ${alpha(entry.color, 0.1)}`,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform: selectedIndex === index ? "translateX(5px)" : "translateX(0)",
                    boxShadow: selectedIndex === index ? `0 8px 20px ${alpha(entry.color, 0.15)}` : "none",
                    "&:hover": {
                      background: alpha(entry.color, 0.1),
                      transform: "translateX(5px)",
                    },
                  }}
                  onMouseEnter={() => handleMouseEnter(null, index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Box
                    sx={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "4px",
                      background: `linear-gradient(135deg, ${entry.color}, ${alpha(entry.color, 0.7)})`,
                      boxShadow: `0 3px 8px ${alpha(entry.color, 0.3)}`,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#333",
                      flex: 1,
                    }}
                  >
                    {entry.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: entry.color,
                      textShadow: `0 1px 3px ${alpha(entry.color, 0.2)}`,
                    }}
                  >
                    {entry.value.toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Loader aprimorado */}
          <Box
            sx={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "3px solid rgba(25, 118, 210, 0.1)",
              borderTop: "3px solid #1976d2",
              boxShadow: "0 0 30px rgba(25, 118, 210, 0.1)",
              animation: "spin 1s linear infinite",
              "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
          />
        </Box>
      )}

      {/* Rodapé aprimorado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          mt: 3,
          pt: 2,
          borderTop: "1px solid rgba(230, 235, 240, 1)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: "13px",
            color: "#666",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontWeight: 500,
          }}
        >
          <Box
            component="span"
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 10px #10b981",
              display: "inline-block",
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%": { boxShadow: "0 0 0 0 rgba(16, 185, 129, 0.4)" },
                "70%": { boxShadow: "0 0 0 10px rgba(16, 185, 129, 0)" },
                "100%": { boxShadow: "0 0 0 0 rgba(16, 185, 129, 0)" },
              },
            }}
          />
          Dados atualizados em tempo real
        </Typography>
      </Box>
    </Box>
  )
}

export default PremiumChartComponent
